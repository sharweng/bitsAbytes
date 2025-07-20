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
      url: `${API_BASE_URL}/products?limit=1000&page=1`,
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

  // Create Products by Types Bar Chart
  function createProductTypesChart() {
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/products?limit=1000&page=1`,
      method: "GET",
      success: (response) => {
        if (response.rows) {
          // Group products by product type
          const typeCount = {}
          response.rows.forEach((product) => {
            const type = product.product_type || "Unknown"
            typeCount[type] = (typeCount[type] || 0) + 1
          })

          const types = Object.keys(typeCount)
          const counts = Object.values(typeCount)
          const colors = [
            "#3B82F6", // blue
            "#10B981", // green
            "#F59E0B", // yellow
            "#EF4444", // red
            "#8B5CF6", // purple
            "#06B6D4", // cyan
          ]

          const ctx = document.getElementById("productTypesChart")
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: types,
              datasets: [
                {
                  label: "Number of Products",
                  data: counts,
                  backgroundColor: colors.slice(0, types.length),
                  borderColor: colors.slice(0, types.length).map((color) => color + "CC"),
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
                title: {
                  display: true,
                  text: "Digital vs Physical Products",
                },
              },
            },
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading products for types chart:", xhr)
      },
    })
  }

  // Create Products by Platform Bar Chart
  function createPlatformChart() {
    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/products?limit=1000&page=1`,
      method: "GET",
      success: (response) => {
        if (response.rows) {
          // Group products by platform type
          const platformCount = {}
          response.rows.forEach((product) => {
            const platform = product.platform_type || "Unknown"
            platformCount[platform] = (platformCount[platform] || 0) + 1
          })

          const platforms = Object.keys(platformCount)
          const counts = Object.values(platformCount)
          const colors = generateRandomColors(platforms.length)

          const ctx = document.getElementById("platformChart")
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: platforms,
              datasets: [
                {
                  label: "Number of Products",
                  data: counts,
                  backgroundColor: colors,
                  borderColor: colors.map((color) => color + "CC"),
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
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 0,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "Games by Gaming Platform",
                },
              },
            },
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading products for platform chart:", xhr)
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
            const date = new Date(order.order_date)
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
                  pointBackgroundColor: "#3B82F6",
                  pointBorderColor: "#ffffff",
                  pointBorderWidth: 2,
                  pointRadius: 5,
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
                title: {
                  display: true,
                  text: "Monthly Order Trends",
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
            "#F97316", // orange for delivered
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
                  hoverOffset: 4,
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
                    font: {
                      size: 12,
                    },
                  },
                },
                title: {
                  display: true,
                  text: "Order Status Breakdown",
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
    createProductTypesChart()
    createPlatformChart()
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
