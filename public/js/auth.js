// Centralized Authentication Functions
const AuthManager = {
  API_BASE_URL: 'http://localhost:4000/api',
  
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return !!(token && user.email)
  },
  
  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}')
  },
  
  // Get auth token
  getToken() {
    return localStorage.getItem('token')
  },
  
  // Login function
  async login(email, password) {
    try {
      const response = await $.ajax({
        url: `${this.API_BASE_URL}/users/login`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password })
      })
      
      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // Trigger auth state change event
        $(document).trigger('authStateChanged', [true, response.user])
        
        return { success: true, user: response.user }
      }
      
      return { success: false, message: response.message || 'Login failed' }
    } catch (xhr) {
      const error = xhr.responseJSON?.message || 'Login failed'
      return { success: false, message: error }
    }
  },
  
  // Logout function
  logout() {
    const wasAuthenticated = this.isAuthenticated()
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cart') // Clear cart on logout
    
    if (wasAuthenticated) {
      // Trigger auth state change event
      $(document).trigger('authStateChanged', [false, null])
    }
    
    return true
  },
  
  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser()
    return user.role === 'admin'
  },
  
  // Require authentication (redirect to login if not authenticated)
  requireAuth(redirectUrl = null) {
    if (!this.isAuthenticated()) {
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        $('#loginModal').removeClass('hidden')
      }
      return false
    }
    return true
  },
  
  // Require admin role
  requireAdmin(redirectUrl = 'index.html') {
    if (!this.isAuthenticated() || !this.isAdmin()) {
      window.location.href = redirectUrl
      return false
    }
    return true
  }
}

// Declare $ and Swal variables
const $ = window.jQuery
const Swal = window.Swal

// Global logout function for backward compatibility
function logout() {
  if (Swal) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        AuthManager.logout()
        
        if (Swal) {
          Swal.fire({
            icon: 'success',
            title: 'Logged out',
            text: 'You have been successfully logged out',
            timer: 1500,
            showConfirmButton: false
          })
        }
        
        // Redirect admin users to home page
        const isAdminPage = window.location.pathname.includes('admin-') || 
                           window.location.pathname.includes('dashboard.html') ||
                           window.location.pathname.includes('users.html')
        
        if (isAdminPage) {
          setTimeout(() => {
            window.location.href = 'index.html'
          }, 1500)
        }
      }
    })
  } else {
    if (confirm('Are you sure you want to logout?')) {
      AuthManager.logout()
      
      const isAdminPage = window.location.pathname.includes('admin-') || 
                         window.location.pathname.includes('dashboard.html') ||
                         window.location.pathname.includes('users.html')
      
      if (isAdminPage) {
        window.location.href = 'index.html'
      }
    }
  }
}

// Make AuthManager globally available
window.AuthManager = AuthManager
window.logout = logout

// Auto-initialize auth state checking
$(document).ready(() => {
  // Listen for auth state changes
  $(document).on('authStateChanged', (event, isAuthenticated, user) => {
    if (typeof window.checkAuthStatus === 'function') {
      window.checkAuthStatus()
    }
    
    if (typeof window.updateCartCount === 'function') {
      window.updateCartCount()
    }
  })
})
