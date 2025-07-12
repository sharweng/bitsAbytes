// Import jQuery
const $ = window.jQuery

$(document).ready(() => {
  const API_BASE_URL = window.API_BASE_URL || "http://localhost:4000/api"

  // Load dashboard statistics
  function loadDashboardStats() {
    // Load users count
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/users`,
      method: "GET",
      success: (response) => {
        console.log("Users response:", response)
        if (response.success) {
          $("#totalUsers").text(response.total_users || 0)
        }
      },
      error: (xhr) => {
        console.error("Error loading users stats:", xhr)
      },
    })

    // Load products count
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/products`,
      method: "GET",
      success: (response) => {
        console.log("Products response:", response)
        if (response.rows) {
          $("#totalProducts").text(response.rows.length)
        }
      },
      error: (xhr) => {
        console.error("Error loading products stats:", xhr)
      },
    })

    // Load reviews count
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/reviews`,
      method: "GET",
      success: (response) => {
        console.log("Reviews response:", response)
        if (response.success) {
          $("#totalReviews").text(response.total_reviews || 0)
        }
      },
      error: (xhr) => {
        console.error("Error loading reviews stats:", xhr)
      },
    })

    // Load orders count
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/orders`,
      method: "GET",
      success: (response) => {
        console.log("Orders response:", response)
        if (response.success) {
          $("#totalOrders").text(response.orders.length || 0)
        }
      },
      error: (xhr) => {
        console.error("Error loading orders stats:", xhr)
      },
    })
  }

  // Initialize dashboard
  if (window.checkAuth && window.checkAuth()) {
    loadDashboardStats()
  }
})
