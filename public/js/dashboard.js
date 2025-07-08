const $ = require("jquery")
const API_BASE_URL = "https://localhost:4000/api"
const makeAuthenticatedRequest = require("./makeAuthenticatedRequest")
const checkAuth = require("./checkAuth")

$(document).ready(() => {
  // Load dashboard statistics
  function loadDashboardStats() {
    // Load users count
    makeAuthenticatedRequest({
      url: `${API_BASE_URL}/users`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          $("#totalUsers").text(response.total_users || 0)
          $("#deactivatedUsers").text(response.deactivated_users || 0)
        }
      },
      error: (xhr) => {
        console.error("Error loading users stats:", xhr)
      },
    })

    // Load products count
    $.ajax({
      url: `${API_BASE_URL}/products`,
      method: "GET",
      success: (response) => {
        if (response.rows) {
          $("#totalProducts").text(response.rows.length)
        }
      },
      error: (xhr) => {
        console.error("Error loading products stats:", xhr)
      },
    })

    // Load reviews count
    $.ajax({
      url: `${API_BASE_URL}/reviews`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          $("#totalReviews").text(response.total_reviews || 0)
        }
      },
      error: (xhr) => {
        console.error("Error loading reviews stats:", xhr)
      },
    })
  }

  // Initialize dashboard
  if (checkAuth()) {
    loadDashboardStats()
  }
})
