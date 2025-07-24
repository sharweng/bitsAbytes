$(document).ready(() => {
  const API_BASE_URL = "http://localhost:4000/api"
  const $ = window.$ // Declare the $ variable
  const Swal = window.Swal // Declare the Swal variable

  // Check if user is authenticated
  function checkAuth() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (
      !token &&
      !window.location.pathname.includes("register.html")
    ) {
      localStorage.setItem('showLoginModal', 'true');
      window.location.href = 'index.html';
      return false
    }

    if (
      token &&
      window.location.pathname.includes("register.html")
    ) {
      window.location.href = "index.html"
      return false
    }

    return true
  }

  // Get auth headers
  function getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  // Make authenticated AJAX request
  function makeAuthenticatedRequest(options) {
    const token = localStorage.getItem("token")
    if (!token) {
      localStorage.setItem('showLoginModal', 'true');
      window.location.href = 'index.html';
      return
    }

    options.headers = options.headers || {}
    options.headers["Authorization"] = `Bearer ${token}`

    const originalError = options.error
    options.error = (xhr) => {
      console.error("AJAX Error:", xhr)
      if (xhr.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.setItem('showLoginModal', 'true');
        window.location.href = 'index.html';
        return
      }
      if (originalError) {
        originalError(xhr)
      }
    }

    return $.ajax(options)
  }

  // Initialize
  checkAuth()

  // Export functions for use in other scripts
  window.API_BASE_URL = API_BASE_URL
  window.getAuthHeaders = getAuthHeaders
  window.makeAuthenticatedRequest = makeAuthenticatedRequest
  window.checkAuth = checkAuth
})
