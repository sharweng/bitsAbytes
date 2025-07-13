// Import jQuery and Swal
const $ = window.$
const Swal = window.Swal

$(document).ready(() => {
  const API_BASE_URL = "http://localhost:4000/api"
  let currentUser = null

  // Initialize page
  initializePage()

  function initializePage() {
    checkAuthStatus()
    initializeEventListeners()
  }

  function checkAuthStatus() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user.email) {
      currentUser = user
      showAuthenticatedState(user)
      loadOrders()
    } else {
      showUnauthenticatedState()
      showLoginRequired()
    }
  }

  function showAuthenticatedState(user) {
    $("#loginBtn").addClass("hidden")
    $("#logoutBtn").removeClass("hidden")
    $("#userInfo").removeClass("hidden")
    $("#userName").text(user.first_name || user.email)
  }

  function showUnauthenticatedState() {
    $("#loginBtn").removeClass("hidden")
    $("#logoutBtn").addClass("hidden")
    $("#userInfo").addClass("hidden")
  }

  function showLoginRequired() {
    $("#loadingState").addClass("hidden")
    $("#noOrders").removeClass("hidden")
    $("#noOrders").html(`
    <i class="fas fa-lock text-6xl text-gray-300 mb-4"></i>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">Login Required</h3>
    <p class="text-gray-600 mb-6">Please login to view your orders.</p>
    <button id="showLoginModal" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
      Login
    </button>
  `)

    $("#showLoginModal").click(() => $("#loginModal").removeClass("hidden"))
  }

  function initializeEventListeners() {
    $("#closeOrderModal").click(() => $("#orderModal").addClass("hidden"))

    // Modal clicks
    $("#orderModal").click(function (e) {
      if (e.target === this) {
        $(this).addClass("hidden")
      }
    })

    // Listen for auth state changes
    $(document).on('authStateChanged', (event, isAuthenticated, user) => {
      if (isAuthenticated) {
        currentUser = user
        showAuthenticatedState(user)
        loadOrders()
      } else {
        currentUser = null
        showUnauthenticatedState()
        showLoginRequired()
      }
    })
  }

  function loadOrders() {
    $("#loadingState").removeClass("hidden")
    $("#noOrders").addClass("hidden")
    $("#ordersList").addClass("hidden")

    $.ajax({
      url: `${API_BASE_URL}/orders/my-orders`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: (response) => {
        $("#loadingState").addClass("hidden")

        if (response.success && response.orders.length > 0) {
          displayOrders(response.orders)
        } else {
          $("#noOrders").removeClass("hidden")
        }
      },
      error: (xhr) => {
        $("#loadingState").addClass("hidden")
        const error = xhr.responseJSON?.message || "Failed to load orders"
        showError(error)
      },
    })
  }

  function displayOrders(orders) {
    $("#ordersList").removeClass("hidden")

    const ordersHtml = orders
      .map((order) => {
        const orderDate = new Date(order.order_date).toLocaleDateString()
        const totalAmount = Number.parseFloat(order.total_amount || 0)
        const statusColor = getStatusColor(order.status)
        const shippingInfo = order.shipping_address ? "Required" : "Digital Only"

        return `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Order #${order.order_id}</h3>
              <p class="text-gray-600 text-sm">Placed on ${orderDate}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
              ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-600">Items</p>
              <p class="font-semibold">${order.total_items} item(s)</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Amount</p>
              <p class="font-semibold">$${totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Shipping</p>
              <p class="font-semibold">${shippingInfo}</p>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">
              ${order.shipped_date ? `Shipped: ${new Date(order.shipped_date).toLocaleDateString()}` : ""}
              ${order.delivered_date ? `Delivered: ${new Date(order.delivered_date).toLocaleDateString()}` : ""}
            </div>
            <button class="view-order bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300" 
                    data-order-id="${order.order_id}">
              View Details
            </button>
          </div>
        </div>
      `
      })
      .join("")

    $("#ordersList").html(ordersHtml)

    // Add event listeners
    $(".view-order").click(function () {
      const orderId = $(this).data("order-id")
      viewOrderDetails(orderId)
    })
  }

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  function viewOrderDetails(orderId) {
    // Show loading in modal
    $("#orderDetails").html(`
    <div class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Loading order details...</p>
    </div>
  `)
    $("#orderModal").removeClass("hidden")

    $.ajax({
      url: `${API_BASE_URL}/orders/my-orders/${orderId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: (response) => {
        if (response.success) {
          displayOrderDetails(response.order)
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to load order details"
        $("#orderDetails").html(`
        <div class="text-center py-8">
          <i class="fas fa-exclamation-triangle text-2xl text-red-600 mb-4"></i>
          <p class="text-red-600">${error}</p>
        </div>
      `)
      },
    })
  }

  function displayOrderDetails(order) {
    const orderDate = new Date(order.order_date).toLocaleDateString()
    const shippedDate = order.shipped_date ? new Date(order.shipped_date).toLocaleDateString() : null
    const deliveredDate = order.delivered_date ? new Date(order.delivered_date).toLocaleDateString() : null
    const statusColor = getStatusColor(order.status)

    const itemsHtml = order.items
      .map((item) => {
        const price = Number.parseFloat(item.price)
        const total = price * item.quantity
        const imageUrl = item.image_url
          ? `${API_BASE_URL.replace("/api", "")}/${item.image_url}`
          : "/placeholder.svg?height=80&width=80"

        const productTypeBadge =
          item.product_type === "digital"
            ? '<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Digital</span>'
            : '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Physical</span>'

        return `
        <div class="flex items-center space-x-4 p-4 border-b border-gray-200">
          <img src="${imageUrl}" alt="${item.title}" class="w-16 h-16 object-cover rounded">
          <div class="flex-1">
            <h4 class="font-semibold">${item.title}</h4>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-sm text-gray-600">Qty: ${item.quantity}</span>
              ${productTypeBadge}
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold">$${price.toFixed(2)} each</p>
            <p class="text-sm text-gray-600">Total: $${total.toFixed(2)}</p>
          </div>
        </div>
      `
      })
      .join("")

    const totalAmount = order.items.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

    $("#orderDetails").html(`
      <div class="space-y-6">
        <!-- Order Header -->
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold text-gray-800">Order #${order.order_id}</h3>
            <p class="text-gray-600">Placed on ${orderDate}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <!-- Customer Info -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Customer Information</h4>
          <p class="text-sm text-gray-600">${order.first_name || ""} ${order.last_name || ""}</p>
          <p class="text-sm text-gray-600">${order.email}</p>
        </div>

        <!-- Shipping Info -->
        ${
          order.user_shipping_address
            ? `
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Shipping Address</h4>
            <p class="text-sm text-gray-600">${order.user_shipping_address}</p>
          </div>
        `
            : `
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Digital Order</h4>
            <p class="text-sm text-blue-600">This order contains only digital products - no shipping required.</p>
          </div>
        `
        }

        <!-- Order Timeline -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Order Timeline</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Order Placed</span>
              <span class="text-gray-600">${orderDate}</span>
            </div>
            ${
              shippedDate
                ? `
              <div class="flex justify-between">
                <span>Shipped</span>
                <span class="text-gray-600">${shippedDate}</span>
              </div>
            `
                : ""
            }
            ${
              deliveredDate
                ? `
              <div class="flex justify-between">
                <span>Delivered</span>
                <span class="text-gray-600">${deliveredDate}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Order Items -->
        <div>
          <h4 class="font-semibold mb-4">Order Items</h4>
          <div class="border border-gray-200 rounded-lg">
            ${itemsHtml}
          </div>
        </div>

        <!-- Order Total -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-semibold">Total Amount</span>
            <span class="text-xl font-bold text-blue-600">$${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `)
  }

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    })
  }
})
