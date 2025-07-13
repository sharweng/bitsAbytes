$(document).ready(() => {
  const API_BASE_URL = window.API_BASE_URL || "http://localhost:4000/api"
  const Swal = window.Swal
  const $ = window.$ // Declare the $ variable
  let currentUser = null
  let ordersTable = null

  // Initialize page
  initializePage()

  function initializePage() {
    checkAuthStatus()
    initializeEventListeners()
    loadOrderStatuses()
    initializeDataTable()
  }

  function checkAuthStatus() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user.email && user.role === "admin") {
      currentUser = user
      $("#userName").text(user.first_name || user.email)
    } else {
      // Redirect to login if not admin
      window.location.href = "login.html"
    }
  }

  function initializeEventListeners() {
    $("#logoutBtn").click(logout)
    $("#closeOrderModal").click(() => $("#orderModal").addClass("hidden"))
    $("#closeStatusModal").click(() => $("#updateStatusModal").addClass("hidden"))
    $("#cancelStatusUpdate").click(() => $("#updateStatusModal").addClass("hidden"))
    $("#updateStatusForm").submit(handleStatusUpdate)
    $("#clearDates").click(clearDates)

    // Modal clicks
    $("#orderModal").click(function (e) {
      if (e.target === this) {
        $(this).addClass("hidden")
      }
    })

    $("#updateStatusModal").click(function (e) {
      if (e.target === this) {
        $(this).addClass("hidden")
      }
    })
  }

  function loadOrderStatuses() {
    $.ajax({
      url: `${API_BASE_URL}/orders/statuses/all`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const statusOptions = response.statuses
            .map(
              (status) =>
                `<option value="${status.stat_id}">${status.description.charAt(0).toUpperCase() + status.description.slice(1)}</option>`,
            )
            .join("")

          $("#newStatus").html(statusOptions)
        }
      },
      error: (xhr) => {
        console.error("Failed to load statuses:", xhr)
      },
    })
  }

  function initializeDataTable() {
    ordersTable = $("#ordersTable").DataTable({
      ajax: {
        url: `${API_BASE_URL}/orders`,
        type: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        dataSrc: (json) => {
          if (json.success) {
            return json.orders
          }
          return []
        },
        error: (xhr) => {
          const error = xhr.responseJSON?.message || "Failed to load orders"
          showError(error)
        },
      },
      columns: [
        {
          data: "order_id",
          render: (data) => `#${data}`,
        },
        {
          data: null,
          render: (data) =>
            `${data.first_name || ""} ${data.last_name || ""}<br><small class="text-gray-600">${data.email}</small>`,
        },
        {
          data: "order_date",
          render: (data) => new Date(data).toLocaleDateString(),
        },
        { data: "total_items" },
        {
          data: "total_amount",
          render: (data) => `$${Number.parseFloat(data || 0).toFixed(2)}`,
        },
        {
          data: null,
          render: (data) => {
            let statusText = data.status.charAt(0).toUpperCase() + data.status.slice(1)
            let statusClass = getStatusClass(data.status)

            if (data.delivered_date) {
              statusText = "Delivered"
              statusClass = "bg-green-100 text-green-800"
            } else if (data.shipped_date) {
              statusText = "Shipped"
              statusClass = "bg-purple-100 text-purple-800"
            }

            return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>`
          },
        },
        {
          data: null,
          render: (data) => `
              <div class="flex space-x-2">
                <button class="view-order bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700" data-order-id="${data.order_id}">
                  <i class="fas fa-eye mr-1"></i>View
                </button>
                <button class="update-status bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700" data-order-id="${data.order_id}">
                  <i class="fas fa-edit mr-1"></i>Update
                </button>
                <button class="delete-order bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700" data-order-id="${data.order_id}">
                  <i class="fas fa-trash mr-1"></i>Delete
                </button>
              </div>
            `,
        },
      ],
      order: [[2, "desc"]], // Sort by date descending
      pageLength: 25,
      responsive: true,
      drawCallback: () => {
        // Add event listeners after table is drawn
        $(".view-order")
          .off("click")
          .on("click", function () {
            const orderId = $(this).data("order-id")
            viewOrderDetails(orderId)
          })

        $(".update-status")
          .off("click")
          .on("click", function () {
            const orderId = $(this).data("order-id")
            showUpdateStatusModal(orderId)
          })

        $(".delete-order")
          .off("click")
          .on("click", function () {
            const orderId = $(this).data("order-id")
            deleteOrder(orderId)
          })
      },
    })
  }

  function getStatusClass(status) {
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
      url: `${API_BASE_URL}/orders/${orderId}`,
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
    const statusClass = getStatusClass(order.status)

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
            <span class="px-3 py-1 rounded-full text-sm font-medium ${statusClass}">
              ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <!-- Customer Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Customer Information</h4>
            <p class="text-sm text-gray-600">${order.first_name || ""} ${order.last_name || ""}</p>
            <p class="text-sm text-gray-600">${order.email}</p>
            ${order.user_shipping_address ? `<p class="text-sm text-gray-600 mt-1">Default Address: ${order.user_shipping_address}</p>` : ""}
          </div>

          <!-- Shipping Info -->
          ${
            order.user_shipping_address // Use user_shipping_address from the joined user table
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

  function showUpdateStatusModal(orderId) {
    // First, get the current order details to populate the form
    $.ajax({
      url: `${API_BASE_URL}/orders/${orderId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: (response) => {
        if (response.success) {
          const order = response.order

          $("#updateOrderId").val(orderId)

          // Set current shipped and delivered dates if they exist
          if (order.shipped_date) {
            const shippedDate = new Date(order.shipped_date).toISOString().split("T")[0]
            $("#shippedDate").val(shippedDate)
          } else {
            $("#shippedDate").val("")
          }

          if (order.delivered_date) {
            const deliveredDate = new Date(order.delivered_date).toISOString().split("T")[0]
            $("#deliveredDate").val(deliveredDate)
          } else {
            $("#deliveredDate").val("")
          }

          $("#updateStatusModal").removeClass("hidden")
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to load order details"
        showError(error)
      },
    })
  }

  function clearDates() {
    $("#shippedDate").val("")
    $("#deliveredDate").val("")
  }

  function handleStatusUpdate(e) {
    e.preventDefault()

    const orderId = $("#updateOrderId").val()
    const statusId = $("#newStatus").val()
    const shippedDate = $("#shippedDate").val()
    const deliveredDate = $("#deliveredDate").val()

    const updateData = {
      stat_id: statusId,
    }

    // Only include dates if they have values, otherwise they'll be set to null
    if (shippedDate) {
      updateData.shipped_date = shippedDate
    } else {
      updateData.shipped_date = null
    }

    if (deliveredDate) {
      updateData.delivered_date = deliveredDate
    } else {
      updateData.delivered_date = null
    }

    $.ajax({
      url: `${API_BASE_URL}/orders/${orderId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(updateData),
      success: (response) => {
        if (response.success) {
          $("#updateStatusModal").addClass("hidden")
          ordersTable.ajax.reload()
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Order status updated successfully",
            timer: 1500,
            showConfirmButton: false,
          })
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to update order"
        showError(error)
      },
    })
  }

  function deleteOrder(orderId) {
    Swal.fire({
      title: "Delete Order?",
      text: "This will permanently delete the order and restore stock for physical products. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${API_BASE_URL}/orders/${orderId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          success: (response) => {
            if (response.success) {
              ordersTable.ajax.reload()
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Order has been deleted and stock restored.",
                timer: 1500,
                showConfirmButton: false,
              })
            }
          },
          error: (xhr) => {
            const error = xhr.responseJSON?.message || "Failed to delete order"
            showError(error)
          },
        })
      }
    })
  }

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

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    })
  }
})
