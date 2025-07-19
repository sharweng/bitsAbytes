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

  // Generate random colors for charts
  function generateRandomColors(count) {
    const colors = []
    for (let i = 0; i < count; i++) {
      const letters = "0123456789ABCDEF".split("")
      let color = "#"
      for (let x = 0; x < 6; x++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      colors.push(color)
    }
    return colors
  }

  // Create Products by Category Bar Chart
  function createProductsChart() {
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/products`,
      method: "GET",
      success: (response) => {
        if (response.rows) {
          // Group products by category
          const categoryCount = {}
          response.rows.forEach((product) => {
            const category = product.category || "Uncategorized"
            categoryCount[category] = (categoryCount[category] || 0) + 1
          })

          const categories = Object.keys(categoryCount)
          const counts = Object.values(categoryCount)
          const colors = generateRandomColors(categories.length)

          const ctx = document.getElementById("productsChart")
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: categories,
              datasets: [
                {
                  label: "Number of Products",
                  data: counts,
                  backgroundColor: colors,
                  borderColor: colors.map((color) => color.replace("0.2", "1")),
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            },
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading products for chart:", xhr)
      },
    })
  }

  // Create Orders Over Time Line Chart
  function createOrdersChart() {
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/orders`,
      method: "GET",
      success: (response) => {
        if (response.success && response.orders) {
          // Group orders by month
          const monthlyOrders = {}
          response.orders.forEach((order) => {
            const date = new Date(order.created_at)
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
            monthlyOrders[monthYear] = (monthlyOrders[monthYear] || 0) + 1
          })

          // Sort months chronologically
          const sortedMonths = Object.keys(monthlyOrders).sort()
          const orderCounts = sortedMonths.map((month) => monthlyOrders[month])

          const ctx = document.getElementById("ordersChart")
          new Chart(ctx, {
            type: "line",
            data: {
              labels: sortedMonths.map((month) => {
                const [year, monthNum] = month.split("-")
                const date = new Date(year, monthNum - 1)
                return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
              }),
              datasets: [
                {
                  label: "Orders per Month",
                  data: orderCounts,
                  borderColor: "#3B82F6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
              },
            },
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading orders for chart:", xhr)
      },
    })
  }

  // Create Order Status Pie Chart
  function createStatusChart() {
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/orders`,
      method: "GET",
      success: (response) => {
        if (response.success && response.orders) {
          // Group orders by status
          const statusCount = {}
          response.orders.forEach((order) => {
            const status = order.status || "pending"
            statusCount[status] = (statusCount[status] || 0) + 1
          })

          const statuses = Object.keys(statusCount)
          const counts = Object.values(statusCount)
          const colors = [
            "#10B981", // green for completed
            "#F59E0B", // yellow for pending
            "#EF4444", // red for cancelled
            "#8B5CF6", // purple for processing
            "#06B6D4", // cyan for shipped
          ]

          const ctx = document.getElementById("statusChart")
          new Chart(ctx, {
            type: "pie",
            data: {
              labels: statuses.map((status) => status.charAt(0).toUpperCase() + status.slice(1)),
              datasets: [
                {
                  label: "Order Status",
                  data: counts,
                  backgroundColor: colors.slice(0, statuses.length),
                  borderColor: "#ffffff",
                  borderWidth: 2,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0)
                      const percentage = ((context.parsed / total) * 100).toFixed(1)
                      return `${context.label}: ${context.parsed} (${percentage}%)`
                    },
                  },
                },
              },
            },
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading orders for status chart:", xhr)
      },
    })
  }

  // Initialize charts
  function initializeCharts() {
    createProductsChart()
    createOrdersChart()
    createStatusChart()
  }

  // Initialize dashboard
  if (window.checkAuth && window.checkAuth()) {
    loadDashboardStats()
    // Add a small delay to ensure DOM is ready
    setTimeout(initializeCharts, 500)
  }
})
