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

    // Validate cart items against current stock levels
    validateCartStock(cart)
  }

  async function validateCartStock(cart) {
    const updatedCart = []
    let hasChanges = false

    for (const item of cart) {
      try {
        // Fetch current product data to get latest stock
        const response = await $.ajax({
          url: `${API_BASE_URL}/products/${item.product_id}`,
          method: "GET",
        })

        if (response.success) {
          const product = response.result
          const isPhysical = product.product_type === "physical"
          const currentStock = Number.parseInt(product.quantity) || 0

          if (isPhysical && currentStock === 0) {
            // Remove out of stock items
            hasChanges = true
            showError(`${item.title} is now out of stock and has been removed from your cart.`)
            continue
          }

          if (isPhysical && item.quantity > currentStock) {
            // Adjust quantity to available stock
            item.quantity = currentStock
            item.stock = currentStock
            hasChanges = true
            showError(`${item.title} quantity has been adjusted to available stock (${currentStock}).`)
          } else {
            // Update stock info
            item.stock = currentStock
            item.product_type = product.product_type
          }

          updatedCart.push(item)
        } else {
          // Product not found, remove from cart
          hasChanges = true
          showError(`${item.title} is no longer available and has been removed from your cart.`)
        }
      } catch (error) {
        console.error(`Error validating product ${item.product_id}:`, error)
        // Keep item in cart if validation fails
        updatedCart.push(item)
      }
    }

    if (hasChanges) {
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    }

    if (updatedCart.length === 0) {
      showEmptyCart()
      return
    }

    displayCartItems(updatedCart)
    updateCartSummary(updatedCart)
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
        const isPhysical = item.product_type === "physical"
        const stock = Number.parseInt(item.stock) || 0

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
              ${isPhysical ? `<p class="text-xs text-gray-500">Stock: ${stock} available</p>` : ""}
            </div>
            
            <div class="flex items-center space-x-3">
              <button class="quantity-btn minus bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center" data-product-id="${item.product_id}">
                <i class="fas fa-minus text-sm"></i>
              </button>
              <span class="quantity font-semibold text-lg w-8 text-center">${item.quantity}</span>
              <button class="quantity-btn plus bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center ${
                isPhysical && item.quantity >= stock ? "opacity-50 cursor-not-allowed" : ""
              }" data-product-id="${item.product_id}" ${isPhysical && item.quantity >= stock ? "disabled" : ""}>
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
      if ($(this).prop("disabled")) return

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

    const item = cart[itemIndex]
    const isPhysical = item.product_type === "physical"
    const stock = Number.parseInt(item.stock) || 0

    if (action === "increase") {
      if (isPhysical && item.quantity >= stock) {
        showError(`Only ${stock} items available in stock`)
        return
      }
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

  async function checkout() {
    if (!currentUser) {
      $("#loginModal").removeClass("hidden")
      return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    if (cart.length === 0) {
      showError("Your cart is empty")
      return
    }

    // Check if user profile is complete
    try {
      const response = await $.ajax({
        url: `${API_BASE_URL}/users/profile/${currentUser.user_id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.success && response.user) {
        const userProfile = response.user
        const isProfileComplete = userProfile.first_name && userProfile.last_name && userProfile.contact_number

        if (!isProfileComplete) {
          Swal.fire({
            icon: "warning",
            title: "Profile Incomplete",
            text: "Please complete your profile information (first name, last name, and contact number) before placing an order.",
            showCancelButton: true,
            confirmButtonText: "Go to Profile",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "profile.html"
            }
          })
          return
        }
      } else {
        throw new Error("Failed to fetch user profile")
      }
    } catch (xhr) {
      console.error("Error fetching user profile:", xhr)
      showError("Error verifying profile information. Please try again.")
      return
    }

    // Validate cart one more time before checkout
    await validateCartStock(cart)
    const finalCart = JSON.parse(localStorage.getItem("cart") || "[]")

    if (finalCart.length === 0) {
      showError("Your cart is empty after stock validation")
      return
    }

    // Determine if there are any physical products in the cart
    const hasPhysicalProducts = finalCart.some((item) => item.product_type === "physical")

    let finalShippingAddress = null

    if (hasPhysicalProducts) {
      // Fetch latest user profile to get current shipping address
      let latestUserProfile
      try {
        const response = await $.ajax({
          url: `${API_BASE_URL}/users/profile/${currentUser.user_id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (response.success && response.user) {
          latestUserProfile = response.user
        } else {
          throw new Error(response.message || "Failed to fetch user profile.")
        }
      } catch (xhr) {
        console.error("Error fetching user profile for shipping:", xhr)
        showError(xhr.responseJSON?.message || "Error fetching your profile to determine shipping address.")
        return
      }

      const currentShippingAddress = latestUserProfile.shipping_address || ""

      const { value: enteredShippingAddress, isConfirmed } = await Swal.fire({
        title: "Shipping Information",
        html: `
                <div class="text-left">
                    <label class="block text-sm font-medium mb-2">Shipping Address</label>
                    <textarea id="shippingAddress" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" rows="3" placeholder="Enter your shipping address...">${currentShippingAddress}</textarea>
                </div>
            `,
        showCancelButton: true,
        confirmButtonText: "Place Order",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const address = document.getElementById("shippingAddress").value.trim()
          if (!address) {
            Swal.showValidationMessage("Please enter a shipping address")
            return false
          }
          return address
        },
      })

      if (!isConfirmed) {
        return // User cancelled shipping address input
      }

      finalShippingAddress = enteredShippingAddress

      // Check if shipping address needs to be updated in the database
      if (finalShippingAddress !== currentShippingAddress) {
        const { isConfirmed: confirmSaveAddress } = await Swal.fire({
          title: "Save Shipping Address?",
          text: "Do you want to save this new shipping address to your profile for future orders?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, save it",
          cancelButtonText: "No, just for this order",
        })

        if (confirmSaveAddress) {
          // Show loading for saving address
          Swal.fire({
            title: "Saving Address...",
            text: "Please wait while we update your shipping address.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })

          try {
            const formData = new FormData()
            formData.append("shipping_address", finalShippingAddress)

            const response = await $.ajax({
              url: `${API_BASE_URL}/users/profile/${currentUser.user_id}`,
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              data: formData,
              processData: false,
              contentType: false,
            })

            if (response.success) {
              // Update local storage user info
              const updatedUser = JSON.parse(localStorage.getItem("user"))
              updatedUser.shipping_address = finalShippingAddress
              localStorage.setItem("user", JSON.stringify(updatedUser))
              Swal.close() // Close saving address loading
              Swal.fire({
                icon: "success",
                title: "Address Saved!",
                text: "Your shipping address has been updated.",
                timer: 1500,
                showConfirmButton: false,
              })
            } else {
              throw new Error(response.message || "Failed to save shipping address.")
            }
          } catch (xhr) {
            console.error("Error saving shipping address:", xhr)
            showError(
              xhr.responseJSON?.message ||
                "Error saving shipping address. Order will proceed with the entered address but it won't be saved to your profile.",
            )
            // Do not return, allow order to proceed with the entered address
          }
        }
      }
    }

    // Proceed to process the order
    processOrder(finalCart, finalShippingAddress)
  }

  function processOrder(cart, shippingAddress) {
    const orderData = {
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      shipping_address: shippingAddress, // Pass shipping address to backend
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
        localStorage.removeItem("user") // Corrected from removeUser to removeItem
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
