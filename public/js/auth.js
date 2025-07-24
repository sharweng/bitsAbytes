// Global authentication functions
let loginInProgress = false
const $ = window.jQuery // Declare the $ variable

function setAuth(user, token) {
  console.log("=== Setting Auth Data ===")
  console.log("User:", user)
  console.log("Token length:", token ? token.length : 0)
  console.log("Token preview:", token ? token.substring(0, 50) + "..." : null)

  // Clear any existing auth data first
  clearAuth()

  // Small delay to ensure localStorage operations complete
  setTimeout(() => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)

    // Verify storage
    const storedToken = localStorage.getItem("token")
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

    console.log("Auth data stored successfully:")
    console.log("- Stored token length:", storedToken ? storedToken.length : 0)
    console.log("- Stored user ID:", storedUser.user_id)
    console.log("- Tokens match:", storedToken === token)
  }, 100)
}

function clearAuth() {
  console.log("=== Clearing Auth Data ===")
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

function getAuth() {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  return { user, token }
}

function isAuthenticated() {
  const { user, token } = getAuth()
  return !!(user.user_id && token)
}

async function loginUser(email, password) {
  if (loginInProgress) {
    console.log("Login already in progress, skipping...")
    return { success: false, message: "Login already in progress" }
  }

  loginInProgress = true
  console.log("=== Starting Login Process ===")
  console.log("Email:", email)

  try {
    const response = await $.ajax({
      url: "http://localhost:4000/api/users/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
    })

    console.log("Login response:", response)

    if (response.success) {
      console.log("Login successful, setting auth data...")
      setAuth(response.user, response.token)

      return {
        success: true,
        message: response.message,
        user: response.user,
        token: response.token,
      }
    } else {
      return {
        success: false,
        message: response.message || "Login failed",
      }
    }
  } catch (xhr) {
    console.error("Login error:", xhr)
    return {
      success: false,
      message: xhr.responseJSON?.message || "Login failed",
    }
  } finally {
    loginInProgress = false
  }
}

async function logoutUser() {
  const { token } = getAuth()

  if (token) {
    try {
      await $.ajax({
        url: "http://localhost:4000/api/users/logout",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  clearAuth()
  window.location.href = "index.html"
}

// Make functions globally available
window.setAuth = setAuth
window.clearAuth = clearAuth
window.getAuth = getAuth
window.isAuthenticated = isAuthenticated
window.loginUser = loginUser
window.logoutUser = logoutUser
