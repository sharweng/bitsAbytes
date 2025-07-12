$(document).ready(() => {
  const API_BASE_URL = "http://localhost:4000/api"
  const Swal = window.Swal
  const $ = window.$ // Declare the $ variable before using it

  let currentUser = null
  const TAX_RATE = 0.08 // 8% tax rate

  // Initialize page
  initializePage()

  function initializePage() {
    checkAuthStatus()
    loadCart()
    initializeEventListeners()
  }

  function checkAuthStatus() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user.email) {
      currentUser = user
      showAuthenticatedState(user)
    } else {
      showUnauthenticatedState()
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

  function initializeEventListeners() {
    // Auth buttons
    $("#loginBtn").click(() => $("#loginModal").removeClass("hidden"))
    $("#logoutBtn").click(logout)
    $(".close-modal").click(() => $("#loginModal").addClass("hidden"))

    // Login form
    $("#loginForm").submit(handleLogin)

    // Cart actions
    $("#clearCartBtn").click(clearCart)
    $("#checkoutBtn").click(checkout)

    // Modal clicks
    $("#loginModal").click(function (e) {
      if (e.target === this) {
        $(this).addClass("hidden")
      }
    })
  }

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    if (cart.length === 0) {
      showEmptyCart()
      return
    }

    displayCartItems(cart)
    updateCartSummary(cart)
  }

  function showEmptyCart() {
    $("#cartItems").addClass("hidden")
    $("#cartSummary").addClass("hidden")
    $("#emptyCart").removeClass("hidden")
  }

  function displayCartItems(cart) {
    $("#emptyCart").addClass("hidden")
    $("#cartItems").removeClass("hidden")
    $("#cartSummary").removeClass("hidden")

    const cartItemsHtml = cart
      .map((item) => {
        const price = Number.parseFloat(item.price)
        const priceDisplay = price === 0 ? "Free" : `$${price.toFixed(2)}`
        const totalPrice = price * item.quantity
        const totalDisplay = totalPrice === 0 ? "Free" : `$${totalPrice.toFixed(2)}`

        const imageUrl = item.image
          ? `${API_BASE_URL.replace("/api", "")}/${item.image}`
          : "/placeholder.svg?height=100&width=100"

        return `
        <div class="bg-white rounded-lg shadow-md p-4 cart-item" data-product-id="${item.product_id}">
          <div class="flex items-center space-x-4">
            <img src="${imageUrl}" alt="${item.title}" class="w-20 h-20 object-cover rounded">
            
            <div class="flex-1">
              <h3 class="font-semibold text-lg">${item.title}</h3>
              <p class="text-gray-600 text-sm">${item.platform_type || "Unknown Platform"}</p>
              <p class="text-blue-600 font-semibold">${priceDisplay}</p>
            </div>
            
            <div class="flex items-center space-x-3">
              <button class="quantity-btn minus bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center" data-product-id="${item.product_id}">
                <i class="fas fa-minus text-sm"></i>
              </button>
              <span class="quantity font-semibold text-lg w-8 text-center">${item.quantity}</span>
              <button class="quantity-btn plus bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center" data-product-id="${item.product_id}">
                <i class="fas fa-plus text-sm"></i>
              </button>
            </div>
            
            <div class="text-right">
              <p class="font-semibold text-lg">${totalDisplay}</p>
              <button class="remove-item text-red-600 hover:text-red-800 text-sm mt-1" data-product-id="${item.product_id}">
                <i class="fas fa-trash mr-1"></i>Remove
              </button>
            </div>
          </div>
        </div>
      `
      })
      .join("")

    $("#cartItems").html(cartItemsHtml)

    // Add event listeners
    $(".quantity-btn").click(function () {
      const productId = Number.parseInt($(this).data("product-id"))
      const action = $(this).hasClass("plus") ? "increase" : "decrease"
      updateQuantity(productId, action)
    })

    $(".remove-item").click(function () {
      const productId = Number.parseInt($(this).data("product-id"))
      removeItem(productId)
    })
  }

  function updateQuantity(productId, action) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const itemIndex = cart.findIndex((item) => item.product_id === productId)

    if (itemIndex === -1) return

    if (action === "increase") {
      cart[itemIndex].quantity += 1
    } else if (action === "decrease") {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1
      } else {
        cart.splice(itemIndex, 1)
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    loadCart()
  }

  function removeItem(productId) {
    Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const updatedCart = cart.filter((item) => item.product_id !== productId)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        loadCart()

        Swal.fire({
          icon: "success",
          title: "Removed!",
          text: "Item has been removed from your cart.",
          timer: 1500,
          showConfirmButton: false,
        })
      }
    })
  }

  function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)
    const tax = subtotal * TAX_RATE
    const total = subtotal + tax

    $("#subtotal").text(`$${subtotal.toFixed(2)}`)
    $("#tax").text(`$${tax.toFixed(2)}`)
    $("#total").text(`$${total.toFixed(2)}`)
  }

  function clearCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    if (cart.length === 0) {
      showError("Your cart is already empty")
      return
    }

    Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("cart")
        loadCart()

        Swal.fire({
          icon: "success",
          title: "Cart Cleared!",
          text: "All items have been removed from your cart.",
          timer: 1500,
          showConfirmButton: false,
        })
      }
    })
  }

  function checkout() {
    if (!currentUser) {
      $("#loginModal").removeClass("hidden")
      return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    if (cart.length === 0) {
      showError("Your cart is empty")
      return
    }

    // Show shipping address input
    Swal.fire({
      title: "Shipping Information",
      html: `
        <div class="text-left">
          <label class="block text-sm font-medium mb-2">Shipping Address</label>
          <textarea id="shippingAddress" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" rows="3" placeholder="Enter your shipping address..."></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Place Order",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const shippingAddress = document.getElementById("shippingAddress").value.trim()
        if (!shippingAddress) {
          Swal.showValidationMessage("Please enter a shipping address")
          return false
        }
        return shippingAddress
      },
    }).then((result) => {
      if (result.isConfirmed) {
        processOrder(cart, result.value)
      }
    })
  }

  function processOrder(cart, shippingAddress) {
    const orderData = {
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      shipping_address: shippingAddress,
    }

    // Show loading
    Swal.fire({
      title: "Processing Order...",
      text: "Please wait while we process your order.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    $.ajax({
      url: `${API_BASE_URL}/orders`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(orderData),
      success: (response) => {
        if (response.success) {
          // Clear cart
          localStorage.removeItem("cart")

          Swal.fire({
            icon: "success",
            title: "Order Placed Successfully!",
            html: `
              <div class="text-center">
                <p class="mb-4">Thank you for your purchase!</p>
                <p class="text-sm text-gray-600">Order ID: #${response.order_id}</p>
                <p class="text-sm text-gray-600">You can track your order in the "My Orders" section.</p>
              </div>
            `,
            confirmButtonText: "View My Orders",
            showCancelButton: true,
            cancelButtonText: "Continue Shopping",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "orders.html"
            } else {
              window.location.href = "index.html"
            }
          })
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to process order"
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: error,
        })
      },
    })
  }

  // Auth functions
  function handleLogin(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    }

    $.ajax({
      url: `${API_BASE_URL}/users/login`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(loginData),
      success: (response) => {
        if (response.success) {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))
          currentUser = response.user
          showAuthenticatedState(response.user)
          $("#loginModal").addClass("hidden")
          Swal.fire({
            icon: "success",
            title: "Welcome!",
            text: "Login successful",
            timer: 1500,
            showConfirmButton: false,
          })
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Login failed"
        showError(error)
      },
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
        currentUser = null
        showUnauthenticatedState()
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been successfully logged out",
          timer: 1500,
          showConfirmButton: false,
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
