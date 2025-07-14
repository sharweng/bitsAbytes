$(document).ready(() => {
  const API_BASE_URL = "http://localhost:4000/api"
  let currentPage = 1
  let isLoading = false
  let hasMoreProducts = true
  let totalProducts = 0
  const currentFilters = {
    search: "",
    platform: null,
    type: null,
    sort: "newest",
  }
  let searchTimeout = null
  const $ = window.$ // Declare the $ variable
  const Swal = window.Swal // Declare the Swal variable

  // Initialize the page
  initializePage()

  function initializePage() {
    checkAuthStatus()
    loadProducts()
    initializeEventListeners()
  }

  // Check authentication status
  function checkAuthStatus() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user.email) {
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

  // Event listeners
  function initializeEventListeners() {
    // Login/Logout
    $("#loginBtn").click(() => $("#loginModal").removeClass("hidden"))
    $("#logoutBtn").click(logout)
    $(".close-modal").click(() => $("#loginModal").addClass("hidden"))
    $("#loginForm").submit(handleLogin)

    // Search functionality
    $("#searchInput").on("input", handleSearchInput)
    $("#searchBtn").click(performSearch)
    $(document).click(hideSearchDropdown)
    $("#searchInput").click((e) => e.stopPropagation())
    $("#searchDropdown").click((e) => e.stopPropagation())

    // Filters
    $(".filter-chip").click(handleFilterClick)
    $("#sortSelect").change(handleSortChange)

    // Infinite scroll
    $(window).scroll(handleScroll)

    // Click outside modal to close
    $("#loginModal").click(function (e) {
      if (e.target === this) {
        $(this).addClass("hidden")
      }
    })

    // Add cart button click handler
    $("#cartBtn").click(() => {
      window.location.href = "cart.html"
    })

    // Initialize cart count on page load
    updateCartCount()
  }

  // Search functionality (for autocomplete dropdown)
  function handleSearchInput() {
    const query = $("#searchInput").val().trim()

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (query.length >= 2) {
      searchTimeout = setTimeout(() => {
        searchProductsForDropdown(query)
      }, 300)
    } else {
      hideSearchDropdown()
    }
  }

  function searchProductsForDropdown(query) {
    // For dropdown, we still get a small sample of all products
    $.ajax({
      url: `${API_BASE_URL}/products?search=${encodeURIComponent(query)}&limit=5&page=1`,
      method: "GET",
      success: (response) => {
        if (response.success && response.products) {
          displaySearchResults(response.products)
        }
      },
      error: (xhr) => {
        console.error("Search error:", xhr)
      },
    })
  }

  function displaySearchResults(products) {
    const resultsHtml = products
      .map(
        (product) => `
            <div class="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 search-result-item" data-product-id="${product.product_id}">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        ${
                          product.images && product.images.length > 0
                            ? `<img src="${API_BASE_URL.replace("/api", "")}/${product.images[0]}" alt="${product.title}" class="w-full h-full object-cover">`
                            : `<i class="fas fa-gamepad text-gray-400 flex items-center justify-center w-full h-full"></i>`
                        }
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${product.title}</p>
                        <p class="text-sm text-gray-500">${product.platform_type || "Unknown Platform"} • $${Number.parseFloat(product.price).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")

    if (products.length === 0) {
      $("#searchResults").html(`
                <div class="px-4 py-3 text-center text-gray-500">
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>No games found</p>
                </div>
            `)
    } else {
      $("#searchResults").html(resultsHtml)
    }

    $("#searchDropdown").removeClass("hidden")

    // Handle search result clicks
    $(".search-result-item").click(function () {
      const productId = $(this).data("product-id")
      viewProductDetails(productId)
      hideSearchDropdown()
    })
  }

  function performSearch() {
    const query = $("#searchInput").val().trim()
    if (query) {
      currentFilters.search = query
      resetAndLoadProducts()
      hideSearchDropdown()
    }
  }

  function hideSearchDropdown() {
    $("#searchDropdown").addClass("hidden")
  }

  // Filter functionality
  function handleFilterClick() {
    const $this = $(this)
    const filter = $this.data("filter")
    const value = $this.data("value")

    // Update active state
    if (filter === "all") {
      $(".filter-chip").removeClass("active")
      $this.addClass("active")
      currentFilters.platform = null
      currentFilters.type = null
    } else {
      $(".filter-chip[data-filter='all']").removeClass("active")

      if (filter === "platform") {
        $(".filter-chip[data-filter='platform']").removeClass("active")
        currentFilters.platform = value
        currentFilters.type = null
        $(".filter-chip[data-filter='type']").removeClass("active")
      } else if (filter === "type") {
        $(".filter-chip[data-filter='type']").removeClass("active")
        currentFilters.type = value
        currentFilters.platform = null
        $(".filter-chip[data-filter='platform']").removeClass("active")
      }

      $this.addClass("active")
    }

    resetAndLoadProducts()
  }

  function handleSortChange() {
    currentFilters.sort = $(this).val()
    resetAndLoadProducts()
  }

  // TRUE INFINITE SCROLL - Server-side pagination
  function loadProducts(append = false) {
    if (isLoading || (!hasMoreProducts && append)) return

    isLoading = true
    $("#loadingIndicator").removeClass("hidden")

    // Build query parameters
    const params = new URLSearchParams({
      page: currentPage,
      limit: 12,
    })

    if (currentFilters.search) {
      params.append("search", currentFilters.search)
    }
    if (currentFilters.platform) {
      params.append("platform", currentFilters.platform)
    }
    if (currentFilters.type) {
      params.append("type", currentFilters.type)
    }
    if (currentFilters.sort) {
      params.append("sort", currentFilters.sort)
    }

    const url = `${API_BASE_URL}/products?${params.toString()}`

    console.log(`Loading page ${currentPage} with filters:`, currentFilters)

    $.ajax({
      url: url,
      method: "GET",
      success: (response) => {
        if (response.success && response.products) {
          const products = response.products
          const pagination = response.pagination

          console.log(`Received ${products.length} products for page ${currentPage}`)
          console.log("Pagination info:", pagination)

          if (products.length === 0 && currentPage === 1) {
            // No products found
            $("#productsGrid").html(`
              <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">No games found</h3>
                <p class="text-gray-500">Try adjusting your search or filters</p>
              </div>
            `)
            hasMoreProducts = false
          } else if (products.length > 0) {
            displayProducts(products, append)

            // Update pagination state
            hasMoreProducts = pagination.hasMore
            totalProducts = pagination.totalProducts
            currentPage++

            // Update UI indicators
            if (!hasMoreProducts) {
              $("#noMoreProducts").removeClass("hidden")
            }
          } else {
            // No more products to load
            hasMoreProducts = false
            $("#noMoreProducts").removeClass("hidden")
          }
        } else {
          console.error("Failed to load products:", response)
          if (currentPage === 1) {
            $("#productsGrid").html(`
              <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Error loading games</h3>
                <p class="text-gray-500">Try again later</p>
              </div>
            `)
          }
        }
      },
      error: (xhr) => {
        console.error("Error loading products:", xhr)
        if (currentPage === 1) {
          $("#productsGrid").html(`
            <div class="col-span-full text-center py-12">
              <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
              <h3 class="text-xl font-semibold text-gray-600 mb-2">Error loading games</h3>
              <p class="text-gray-500">Check your connection and try again</p>
            </div>
          `)
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load more products. Try again.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          })
        }
      },
      complete: () => {
        isLoading = false
        $("#loadingIndicator").addClass("hidden")
      },
    })
  }

  function displayProducts(products, append = false) {
    const productsHtml = products.map((product) => createProductCard(product)).join("")

    if (append) {
      $("#productsGrid").append(productsHtml)
    } else {
      $("#productsGrid").html(productsHtml)
    }

    // Store products data for cart functionality
    window.currentProducts = window.currentProducts || []
    if (append) {
      window.currentProducts = window.currentProducts.concat(products)
    } else {
      window.currentProducts = products
    }

    // Remove existing event handlers to prevent duplicates
    $(document).off("click", ".add-to-cart-btn")
    $(document).off("click", ".buy-now-btn")
    $(document).off("click", ".product-image, .product-title")

    // Add click handlers for product cards
    $(document).on("click", ".product-image, .product-title", function () {
      const productId = $(this).data("product-id")
      window.location.href = `product-detail.html?id=${productId}`
    })

    // Add to cart buttons - prevent duplicate event handlers
    $(document).on("click", ".add-to-cart-btn", function (e) {
      e.stopPropagation()
      const $btn = $(this)

      // Disable the button immediately
      $btn.prop("disabled", true)

      const productId = Number.parseInt($btn.data("product-id"))
      const product = window.currentProducts.find((p) => p.product_id === productId)

      if (product) {
        addToCart(product, () => {
          $btn.prop("disabled", false) // Re-enable button after operation
        })
      } else {
        $btn.prop("disabled", false) // Re-enable button if product not found
      }
    })

    // Buy now buttons
    $(document).on("click", ".buy-now-btn", function (e) {
      e.stopPropagation()
      const $btn = $(this)

      // Disable the button immediately
      $btn.prop("disabled", true)

      const productId = Number.parseInt($btn.data("product-id"))
      const product = window.currentProducts.find((p) => p.product_id === productId)

      if (product) {
        buyNow(product, () => {
          $btn.prop("disabled", false) // Re-enable button after operation
        })
      } else {
        $btn.prop("disabled", false) // Re-enable button if product not found
      }
    })

    // Update products count display
    const currentCount = $("#productsGrid .product-card").length
    console.log(`Now showing ${currentCount} of ${totalProducts} total products`)
  }

  function createProductCard(product) {
    const imageUrl =
      product.images && product.images.length > 0
        ? `${API_BASE_URL.replace("/api", "")}/${product.images[0]}`
        : "/placeholder.svg?height=200&width=300"

    const price = Number.parseFloat(product.price)
    const priceDisplay = price === 0 ? "Free" : `$${price.toFixed(2)}`

    // Generate star rating
    const avgRating = Number.parseFloat(product.average_rating) || 0
    const reviewCount = Number.parseInt(product.review_count) || 0
    const starsHtml = generateStarRating(avgRating)

    return `
      <div class="product-card bg-white rounded-lg shadow-md overflow-hidden" data-product-id="${product.product_id}">
        <div class="relative cursor-pointer product-image" data-product-id="${product.product_id}">
          <img src="${imageUrl}" alt="${product.title}" class="w-full h-48 object-cover">
          <div class="absolute top-2 right-2">
            <span class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              ${product.platform_type || "Unknown"}
            </span>
          </div>
          ${price === 0 ? '<div class="absolute top-2 left-2"><span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs">FREE</span></div>' : ""}
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer product-title" data-product-id="${product.product_id}">${product.title}</h3>
          <p class="text-gray-600 text-sm mb-2 line-clamp-2">${product.description || "No description available"}</p>
          
          <!-- Rating and Reviews -->
          <div class="flex items-center space-x-2 mb-2">
            <div class="flex items-center space-x-1">
              ${starsHtml}
            </div>
            <span class="text-sm text-gray-500">(${reviewCount})</span>
          </div>
          
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-500">${product.developer || "Unknown Developer"}</span>
            <span class="text-sm text-gray-500">${product.product_type || "Digital"}</span>
          </div>
          
          <div class="flex justify-between items-center mb-3">
            <span class="text-2xl font-bold text-blue-600">${priceDisplay}</span>
            <div class="flex items-center space-x-1">
              <i class="fas fa-box text-gray-400"></i>
              <span class="text-sm text-gray-500">${product.quantity || 0} in stock</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-2">
            <div class="flex space-x-2">
              <button class="add-to-cart-btn flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium transition duration-200" data-product-id="${product.product_id}">
                <i class="fas fa-cart-plus mr-1"></i>Add to Cart
              </button>
              <button class="buy-now-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm font-medium transition duration-200" data-product-id="${product.product_id}">
                <i class="fas fa-bolt mr-1"></i>Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  function generateStarRating(rating) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    let starsHtml = ""

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star text-yellow-400 text-xs"></i>'
    }

    // Half star
    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt text-yellow-400 text-xs"></i>'
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star text-gray-300 text-xs"></i>'
    }

    return starsHtml
  }

  function resetAndLoadProducts() {
    currentPage = 1
    hasMoreProducts = true
    totalProducts = 0
    $("#noMoreProducts").addClass("hidden")
    loadProducts(false)
  }

  // TRUE INFINITE SCROLL - Trigger when near bottom
  function handleScroll() {
    const scrollTop = $(window).scrollTop()
    const windowHeight = $(window).height()
    const documentHeight = $(document).height()

    // Trigger when user is 1000px from bottom
    if (scrollTop + windowHeight >= documentHeight - 1000) {
      if (hasMoreProducts && !isLoading) {
        console.log(`Infinite scroll triggered - loading page ${currentPage}`)
        loadProducts(true)
      }
    }
  }

  // Product details modal
  function viewProductDetails(productId) {
    $.ajax({
      url: `${API_BASE_URL}/products/${productId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const product = response.result
          showProductModal(product)
        }
      },
      error: (xhr) => {
        console.error("Error loading product details:", xhr)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product details",
        })
      },
    })
  }

  function showProductModal(product) {
    const imagesHtml =
      product.images && product.images.length > 0
        ? product.images
            .map(
              (img) =>
                `<img src="${API_BASE_URL.replace("/api", "")}/${img}" alt="${product.title}" class="w-full h-64 object-cover rounded-lg mb-2">`,
            )
            .join("")
        : `<div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                 <i class="fas fa-gamepad text-4xl text-gray-400"></i>
               </div>`

    const price = Number.parseFloat(product.price)
    const priceDisplay = price === 0 ? "Free" : `$${price.toFixed(2)}`

    Swal.fire({
      title: product.title,
      html: `
                <div class="text-left">
                    ${imagesHtml}
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div><strong>Platform:</strong> ${product.platform_type || "Unknown"}</div>
                        <div><strong>Type:</strong> ${product.product_type || "Digital"}</div>
                        <div><strong>Developer:</strong> ${product.developer || "Unknown"}</div>
                        <div><strong>Publisher:</strong> ${product.publisher || "Unknown"}</div>
                        <div><strong>Price:</strong> <span class="text-blue-600 font-bold">${priceDisplay}</span></div>
                        <div><strong>Stock:</strong> ${product.quantity || 0} available</div>
                    </div>
                    ${product.release_date ? `<div class="mb-4"><strong>Release Date:</strong> ${new Date(product.release_date).toLocaleDateString()}</div>` : ""}
                    <div class="mb-4">
                        <strong>Description:</strong>
                        <p class="mt-2 text-gray-600">${product.description || "No description available"}</p>
                    </div>
                </div>
            `,
      width: "800px",
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: "text-left",
      },
    })
  }

  // Authentication
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
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error,
        })
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

  function addToCart(product, callback) {
    const token = localStorage.getItem("token")
    if (!token) {
      $("#loginModal").removeClass("hidden")
      if (callback) callback()
      return
    }

    if (!product || !product.product_id) {
      showError("Product data not available")
      if (callback) callback()
      return
    }

    // Get current cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = cart.findIndex((item) => item.product_id === product.product_id)

    if (existingItemIndex !== -1) {
      // Item already exists, increase quantity
      cart[existingItemIndex].quantity += 1
    } else {
      // Add new item to cart
      cart.push({
        product_id: product.product_id,
        title: product.title,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        platform_type: product.platform_type,
        product_type: product.product_type || "digital",
        quantity: 1,
      })
    }

    // Save cart
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()

    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.title} has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false,
    })

    if (callback) callback()
  }

  function buyNow(product, callback) {
    const token = localStorage.getItem("token")
    if (!token) {
      $("#loginModal").removeClass("hidden")
      if (callback) callback()
      return
    }

    if (!product || !product.product_id) {
      showError("Product data not available")
      if (callback) callback()
      return
    }

    // Add to cart first
    addToCart(product, () => {
      // Then redirect to cart
      window.location.href = "cart.html"
      if (callback) callback()
    })
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    if (totalItems > 0) {
      $("#cartCount").text(totalItems).removeClass("hidden")
    } else {
      $("#cartCount").addClass("hidden")
    }
  }

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
    })
  }
})
