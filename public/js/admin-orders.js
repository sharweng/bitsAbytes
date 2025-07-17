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
    } else {
      // Redirect to login if not admin
      localStorage.setItem("showLoginModal", "true")
      window.location.href = "index.html"
    }
  }

  function initializeEventListeners() {
    $("#closeOrderModal").click(() => $("#orderModal").addClass("hidden"))
    $("#closeStatusModal").click(() => $("#updateStatusModal").addClass("hidden"))
    $("#cancelStatusUpdate").click(() => $("#updateStatusModal").addClass("hidden"))
    $("#updateStatusForm").submit(handleStatusUpdate)

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

    // Handle status dropdown change
    $("#newStatus").on("change", function () {
      const selectedStatusId = Number.parseInt($(this).val())
      // Assuming 1=Pending, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled

      if (selectedStatusId === 1 || selectedStatusId === 5) {
        // Pending or Cancelled
        $("#shippedDate").val("").prop("disabled", true) // Clear and disable
        $("#deliveredDate").val("").prop("disabled", true) // Clear and disable
      } else if (selectedStatusId === 2) {
        // Processing
        $("#shippedDate").prop("disabled", false) // Enable shipped date
        $("#deliveredDate").val("").prop("disabled", true) // Clear and disable delivered date
      } else if (selectedStatusId === 3) {
        // Shipped
        $("#shippedDate").prop("disabled", false) // Enable shipped date
        $("#deliveredDate").val("").prop("disabled", true) // Clear and disable delivered date
      } else if (selectedStatusId === 4) {
        // Delivered
        $("#shippedDate").prop("disabled", false) // Enable shipped date
        $("#deliveredDate").prop("disabled", false) // Enable delivered date
      } else {
        // Default state for other statuses
        $("#shippedDate").prop("disabled", true)
        $("#deliveredDate").prop("disabled", true)
      }
    })
  }

  function loadOrderStatuses() {
    $.ajax({
      url: `${API_BASE_URL}/orders/statuses/all`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          // Filter to only show Pending (1), Processing (2), Shipped (3), Delivered (4), Cancelled (5)
          const filteredStatuses = response.statuses.filter(
            (status) =>
              status.stat_id === 1 ||
              status.stat_id === 2 ||
              status.stat_id === 3 ||
              status.stat_id === 4 ||
              status.stat_id === 5,
          )
          const statusOptions = filteredStatuses
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

            // The backend now handles status derivation from dates,
            // so we primarily display the 'status' field from the database.
            // However, if delivered_date or shipped_date are explicitly set,
            // we can still show the final state for clarity in the table.
            if (data.delivered_date) {
              statusText = "Delivered"
              statusClass = "bg-green-100 text-green-800"
            } else if (data.shipped_date) {
              statusText = "Shipped"
              statusClass = "bg-purple-100 text-purple-800"
            } else {
              // Fallback to actual status from DB if no dates are set
              statusText = data.status.charAt(0).toUpperCase() + data.status.slice(1)
              statusClass = getStatusClass(data.status)
            }

            return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>`
          },
        },
        {
          data: null,
          render: (data) => `
              <button class="text-green-600 hover:text-green-800 mr-2 view-order" data-order-id="${data.order_id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="text-blue-600 hover:text-blue-800 mr-2 update-status" data-order-id="${data.order_id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-red-600 hover:text-red-800 delete-order" data-order-id="${data.order_id}">
                <i class="fas fa-trash"></i>
              </button>
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
    $.ajax({
      url: `${API_BASE_URL}/orders/${orderId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: (response) => {
        if (response.success) {
          Swal.fire({
            title: `Order #${response.order.order_id}`,
            width: "80%",
            showConfirmButton: false,
            showCloseButton: true,
            html: generateOrderHtml(response.order),
            scrollbarPadding: false,
            customClass: {
              popup: "text-left max-h-[80vh] overflow-y-auto",
            },
          })
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to load order details"
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error,
        })
      },
    })
  }

  function generateOrderHtml(order) {
    const orderDate = new Date(order.order_date).toLocaleDateString()
    const shippedDate = order.shipped_date ? new Date(order.shipped_date).toLocaleDateString() : null
    const deliveredDate = order.delivered_date ? new Date(order.delivered_date).toLocaleDateString() : null

    const itemsHtml = order.items
      .map((item) => {
        const price = Number.parseFloat(item.price)
        const total = price * item.quantity
        const productTypeBadge =
          item.product_type === "digital"
            ? '<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Digital</span>'
            : '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Physical</span>'
        const imageUrl = item.image_url
          ? `${window.API_BASE_URL.replace("/api", "")}/${item.image_url}`
          : "/placeholder.svg"

        return `
        <div class="flex items-center gap-4 border-b py-3">
          <img src="${imageUrl}" alt="${item.title}" class="w-16 h-16 object-cover rounded">
          <div class="flex-1">
            <p class="font-semibold">${item.title}</p>
            <div class="text-sm text-gray-600">Qty: ${item.quantity} | $${price.toFixed(2)} each</div>
            ${productTypeBadge}
          </div>
          <div class="text-right text-sm font-medium">$${total.toFixed(2)}</div>
        </div>
      `
      })
      .join("")

    const totalAmount = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

    return `
      <div class="text-sm space-y-4">
        <div>
          <p class="font-semibold">Customer:</p>
          <p>${order.first_name} ${order.last_name}</p>
          <p class="text-gray-600">${order.email}</p>
        </div>

        <div>
          <p class="font-semibold">Status:</p>
          <p class="capitalize">${order.status}</p>
        </div>

        <div>
          <p class="font-semibold">Timeline:</p>
          <ul class="text-gray-700 list-disc ml-5">
            <li>Placed: ${orderDate}</li>
            ${shippedDate ? `<li>Shipped: ${shippedDate}</li>` : ""}
            ${deliveredDate ? `<li>Delivered: ${deliveredDate}</li>` : ""}
          </ul>
        </div>

        <div>
          <p class="font-semibold mb-2">Items:</p>
          ${itemsHtml}
        </div>

        <div class="pt-4 border-t">
          <p class="text-right font-bold text-blue-700">Total: $${totalAmount.toFixed(2)}</p>
        </div>
      </div>
    `
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
          $("#newStatus").val(order.stat_id) // Set the current status in the dropdown

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

          // Manually trigger change to apply correct date input states
          $("#newStatus").trigger("change")

          $("#updateStatusModal").removeClass("hidden")
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to load order details"
        showError(error)
      },
    })
  }

  function handleStatusUpdate(e) {
    e.preventDefault()

    const orderId = $("#updateOrderId").val()
    const statusId = Number.parseInt($("#newStatus").val()) // Parse to integer
    const shippedDate = $("#shippedDate").val()
    const deliveredDate = $("#deliveredDate").val()

    const updateData = {
      stat_id: statusId,
      shipped_date: shippedDate || null,
      delivered_date: deliveredDate || null,
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

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    })
  }
})
