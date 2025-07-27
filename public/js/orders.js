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
    loadOrderStatusesForFilter() // Load statuses for the filter dropdown
  }

  function checkAuthStatus() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user.email) {
      currentUser = user
      showAuthenticatedState(user)
      loadOrders() // Load orders initially without filter
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
      <h3 class="text-xl font-semibold text-gray-200 mb-2">Login Required</h3>
      <p class="text-gray-400 mb-6">Please login to view your orders.</p>
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
    $(document).on("authStateChanged", (event, isAuthenticated, user) => {
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

    // Filter dropdown change event
    $("#statusFilter").on("change", function () {
      const selectedStatusId = $(this).val()
      loadOrders(selectedStatusId)
    })
  }

  function loadOrderStatusesForFilter() {
    $.ajax({
      url: `${API_BASE_URL}/orders/statuses/all`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          let statusOptions = '<option value="" class="bg-gray-700">All Orders</option>'
          response.statuses.forEach((status) => {
            statusOptions += `<option value="${status.stat_id}" class="bg-gray-700">${status.description.charAt(0).toUpperCase() + status.description.slice(1)}</option>`
          })
          $("#statusFilter").html(statusOptions)
        }
      },
      error: (xhr) => {
        console.error("Failed to load statuses for filter:", xhr)
      },
    })
  }

  function loadOrders(statusFilter = null) {
    $("#loadingState").removeClass("hidden")
    $("#noOrders").addClass("hidden")
    $("#ordersList").addClass("hidden")

    const url = statusFilter
      ? `${API_BASE_URL}/orders/my-orders?status_filter=${statusFilter}`
      : `${API_BASE_URL}/orders/my-orders`

    $.ajax({
      url: url,
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
          $("#ordersList").addClass("hidden") // Ensure orders list is hidden if no orders
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
    $("#noOrders").addClass("hidden") // Ensure no orders message is hidden

    const ordersHtml = orders
      .map((order) => {
        const orderDate = new Date(order.order_date)
        // Order is cancellable only if its status is 'pending'
        const isCancellable = order.status.toLowerCase() === "pending"

        const orderDateFormatted = orderDate.toLocaleDateString()
        const totalAmount = Number.parseFloat(order.total_amount || 0)
        const statusColor = getStatusColor(order.status)

        // Determine order type (Digital Only, Physical Only, Mixed)
        let orderType = "N/A"
        if (order.product_types_in_order) {
          const types = order.product_types_in_order.split(",")
          const hasDigital = types.includes("digital")
          const hasPhysical = types.includes("physical")

          if (hasDigital && !hasPhysical) {
            orderType = "Digital Only"
          } else if (!hasDigital && hasPhysical) {
            orderType = "Physical Only"
          } else if (hasDigital && hasPhysical) {
            orderType = "Mixed"
          }
        }

        let cancelButtonHtml = ""
        if (isCancellable) {
          cancelButtonHtml = `
          <button class="cancel-order-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
                  data-order-id="${order.order_id}" title="Click to cancel this order">
            Cancel Order
          </button>
        `
        }

        let deliveredButtonHtml = ""
        if (order.status.toLowerCase() === "shipped") {
          deliveredButtonHtml = `
          <button class="mark-delivered-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300"
                  data-order-id="${order.order_id}" title="Mark this order as delivered">
            Delivered
          </button>
        `
        }

        return `
      <div class="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-700">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-100">Order #${order.order_id}</h3>
            <p class="text-gray-400 text-sm">Placed on ${orderDateFormatted}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-400">Items</p>
            <p class="font-semibold text-gray-100">${order.total_items} item(s)</p>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total Amount</p>
            <p class="font-semibold text-gray-100">₱${totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p class="text-sm text-gray-400">Type</p>
            <p class="font-semibold text-gray-100">${orderType}</p>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-400">
            ${order.shipped_date ? `Shipped: ${new Date(order.shipped_date).toLocaleDateString()}` : ""}
            ${order.delivered_date ? `Delivered: ${new Date(order.delivered_date).toLocaleDateString()}` : ""}
          </div>
          <div class="flex space-x-2">
            <button class="view-order bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300" 
                    data-order-id="${order.order_id}">
              View Details
            </button>
            ${deliveredButtonHtml}
            ${cancelButtonHtml}
          </div>
        </div>
      </div>
    `
      })
      .join("")

    $("#ordersList").html(ordersHtml)

    // Add event listeners
    $(".view-order")
      .off("click")
      .on("click", function () {
        const orderId = $(this).data("order-id")
        viewOrderDetails(orderId)
      })

    $(".cancel-order-btn")
      .off("click")
      .on("click", function () {
        const orderId = $(this).data("order-id")
        cancelOrder(orderId)
      })

    $(".mark-delivered-btn")
      .off("click")
      .on("click", function () {
        const orderId = $(this).data("order-id")
        markOrderAsDelivered(orderId)
      })
  }

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-800 text-yellow-100"
      case "processing":
        return "bg-blue-800 text-blue-100"
      case "shipped":
        return "bg-purple-800 text-purple-100"
      case "delivered":
        return "bg-green-800 text-green-100"
      case "cancelled":
        return "bg-red-800 text-red-100"
      default:
        return "bg-gray-700 text-gray-100"
    }
  }

  function viewOrderDetails(orderId) {
    // Show loading in modal
    $("#orderDetails").html(`
      <div class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-2xl text-blue-500 mb-4"></i>
        <p class="text-gray-400">Loading order details...</p>
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
            <i class="fas fa-exclamation-triangle text-2xl text-red-500 mb-4"></i>
            <p class="text-red-400">${error}</p>
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

    // Determine product types in the order
    const hasDigital = order.items.some((item) => item.product_type === "digital")
    const hasPhysical = order.items.some((item) => item.product_type === "physical")

    let shippingInfoBlock = ""
    if (hasDigital && !hasPhysical) {
      shippingInfoBlock = `
        <div class="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-800">
          <h4 class="font-semibold text-blue-300 mb-2">Order Type: Digital Only</h4>
          <p class="text-sm text-blue-400">This order contains only digital products - no shipping required.</p>
        </div>
      `
    } else if (!hasDigital && hasPhysical) {
      shippingInfoBlock = `
        <div class="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-800">
          <h4 class="font-semibold text-green-300 mb-2">Order Type: Physical Only</h4>
          <p class="text-sm text-green-400">This order contains only physical products and will be shipped to your address.</p>
          <p class="text-sm text-gray-400 mt-2">Shipping Address: ${order.user_shipping_address || "N/A"}</p>
        </div>
      `
    } else if (hasDigital && hasPhysical) {
      shippingInfoBlock = `
        <div class="bg-yellow-900 bg-opacity-30 p-4 rounded-lg border border-yellow-800">
          <h4 class="font-semibold text-yellow-300 mb-2">Order Type: Mixed (Digital & Physical)</h4>
          <p class="text-sm text-yellow-400">This order contains both digital and physical products.</p>
          <p class="text-sm text-gray-400 mt-2">Physical items will be shipped to: ${order.user_shipping_address || "N/A"}</p>
        </div>
      `
    } else {
      shippingInfoBlock = `
        <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 class="font-semibold text-gray-300 mb-2">Order Type</h4>
          <p class="text-sm text-gray-400">No specific product type information available.</p>
        </div>
      `
    }

    const itemsHtml = order.items
      .map((item) => {
        const price = Number.parseFloat(item.price)
        const total = price * item.quantity
        const imageUrl = item.image_url
          ? `${item.image_url}`
          : "/placeholder.svg?height=80&width=80"

        const productTypeBadge =
          item.product_type === "digital"
            ? '<span class="bg-blue-800 text-blue-100 text-xs px-2 py-1 rounded">Digital</span>'
            : '<span class="bg-green-800 text-green-100 text-xs px-2 py-1 rounded">Physical</span>'

        return `
        <div class="flex items-center space-x-4 p-4 border-b border-gray-700">
          <img src="${imageUrl}" alt="${item.title}" class="w-16 h-16 object-cover rounded cursor-pointer product-item-image" data-product-id="${item.product_id}">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-100 cursor-pointer hover:text-blue-400 transition duration-300 product-item-title" data-product-id="${item.product_id}">${item.title}</h4>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-sm text-gray-400">Qty: ${item.quantity}</span>
              ${productTypeBadge}
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-100">₱${price.toFixed(2)} each</p>
            <p class="text-sm text-gray-400">Total: ₱${total.toFixed(2)}</p>
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
            <h3 class="text-xl font-bold text-gray-100">Order #${order.order_id}</h3>
            <p class="text-gray-400">Placed on ${orderDate}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <!-- Customer Info -->
        <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 class="font-semibold text-gray-300 mb-2">Customer Information</h4>
          <p class="text-sm text-gray-400">${order.first_name || ""} ${order.last_name || ""}</p>
          <p class="text-sm text-gray-400">${order.email}</p>
        </div>

        <!-- Shipping Info (Conditional) -->
        ${shippingInfoBlock}

        <!-- Order Timeline -->
        <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 class="font-semibold text-gray-300 mb-2">Order Timeline</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-300">Order Placed</span>
              <span class="text-gray-400">${orderDate}</span>
            </div>
            ${
              shippedDate
                ? `
              <div class="flex justify-between">
                <span class="text-gray-300">Shipped</span>
                <span class="text-gray-400">${shippedDate}</span>
              </div>
            `
                : ""
            }
            ${
              deliveredDate
                ? `
              <div class="flex justify-between">
                <span class="text-gray-300">Delivered</span>
                <span class="text-gray-400">${deliveredDate}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Order Items -->
        <div>
          <h4 class="font-semibold text-gray-300 mb-4">Order Items</h4>
          <div class="border border-gray-700 rounded-lg">
            ${itemsHtml}
          </div>
        </div>

        <!-- Order Total -->
        <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-300">Total Amount</span>
            <span class="text-xl font-bold text-blue-400">₱${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `)

    // Add click handlers for product items
    $(".product-item-image, .product-item-title").click(function () {
      const productId = $(this).data("product-id")
      window.location.href = `product-detail.html?id=${productId}`
    })
  }

  async function markOrderAsDelivered(orderId) {
    Swal.fire({
      title: "Mark as Delivered?",
      text: "Are you sure you want to mark this order as delivered?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as delivered!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Marking as Delivered...",
          text: "Please wait while the order is being marked as delivered.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const requestFn = window.makeAuthenticatedRequest || $.ajax
        const deliveredDate = new Date().toISOString().split("T")[0] // Current date

        // Fetch current order details to get the existing shipped_date
        let currentShippedDate = null
        try {
          const orderResponse = await $.ajax({
            url: `${API_BASE_URL}/orders/my-orders/${orderId}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          if (orderResponse.success && orderResponse.order) {
            currentShippedDate = orderResponse.order.shipped_date
              ? new Date(orderResponse.order.shipped_date).toISOString().split("T")[0]
              : null
          }
        } catch (error) {
          console.error("Error fetching current order details:", error)
          Swal.close()
          showError("Failed to fetch current order details. Cannot mark as delivered.")
          return
        }

        requestFn({
          url: `${API_BASE_URL}/orders/${orderId}`,
          method: "PUT",
          headers: window.makeAuthenticatedRequest
            ? undefined
            : {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
          data: JSON.stringify({
            stat_id: 4, // Assuming 4 is the stat_id for 'delivered'
            shipped_date: currentShippedDate, // Preserve existing shipped date
            delivered_date: deliveredDate,
          }),
          success: (response) => {
            Swal.close()
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "Order Delivered!",
                text: "Your order has been successfully marked as delivered.",
                timer: 1500,
                showConfirmButton: false,
              })
              loadOrders($("#statusFilter").val()) // Reload orders to reflect the change, preserving current filter
            }
          },
          error: (xhr) => {
            Swal.close()
            const error = xhr.responseJSON?.message || "Failed to mark order as delivered"
            showError(error)
          },
        })
      }
    })
  }

  function cancelOrder(orderId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel this order. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Cancelling Order...",
          text: "Please wait while the order is being cancelled.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Use window.makeAuthenticatedRequest if available, otherwise fallback to $.ajax
        const requestFn = window.makeAuthenticatedRequest || $.ajax

        requestFn({
          url: `${API_BASE_URL}/orders/${orderId}`,
          method: "PUT",
          // Headers are handled by makeAuthenticatedRequest, but explicitly setting for direct $.ajax fallback
          headers: window.makeAuthenticatedRequest
            ? undefined
            : {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
          data: JSON.stringify({ stat_id: 5 }), // Assuming 5 is the stat_id for 'cancelled'
          success: (response) => {
            Swal.close()
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "Order Cancelled!",
                text: "Your order has been successfully cancelled.",
                timer: 1500,
                showConfirmButton: false,
              })
              loadOrders($("#statusFilter").val()) // Reload orders to reflect the change, preserving current filter
            }
          },
          error: (xhr) => {
            Swal.close()
            const error = xhr.responseJSON?.message || "Failed to cancel order"
            showError(error)
          },
        })
      }
    })
  }

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    })
  }
})
