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
      !window.location.pathname.includes("login.html") &&
      !window.location.pathname.includes("register.html")
    ) {
      window.location.href = "login.html"
      return false
    }

    if (
      token &&
      (window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html"))
    ) {
      window.location.href = "index.html"
      return false
    }

    return true
  }

  // Load navbar
  function loadNavbar() {
    if (checkAuth() && localStorage.getItem("token")) {
      $("#navbar").load("navbar.html", () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        $("#userEmail").text(user.email || "User")

        $("#logoutBtn").on("click", () => {
          logout()
        })
      })
    }
  }

  // Login function
  $("#loginForm").on("submit", (e) => {
    e.preventDefault()

    const email = $("#email").val()
    const password = $("#password").val()

    $.ajax({
      url: `${API_BASE_URL}/users/login`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: (response) => {
        if (response.success) {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.message,
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "index.html"
          })
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.message || "An error occurred during login",
        })
      },
    })
  })

  // Register function
  $("#registerForm").on("submit", (e) => {
    e.preventDefault()

    const email = $("#email").val()
    const password = $("#password").val()
    const confirmPassword = $("#confirmPassword").val()

    // Validate password confirmation
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match. Please try again.",
      })
      return
    }

    // Validate password length
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Password Too Short",
        text: "Password must be at least 6 characters long.",
      })
      return
    }

    $.ajax({
      url: `${API_BASE_URL}/users/register`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: (response) => {
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful!",
            text: response.message,
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "login.html"
          })
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.message || "An error occurred during registration",
        })
      },
    })
  })

  // Logout function
  function logout() {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "login.html"
      }
    })
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
      window.location.href = "login.html"
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
        window.location.href = "login.html"
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
  loadNavbar()

  // Export functions for use in other scripts
  window.API_BASE_URL = API_BASE_URL
  window.getAuthHeaders = getAuthHeaders
  window.makeAuthenticatedRequest = makeAuthenticatedRequest
  window.checkAuth = checkAuth
})
