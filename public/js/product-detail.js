$(document).ready(() => {
  const API_BASE_URL = "http://localhost:4000/api"
  const Swal = window.Swal
  const $ = window.$ // Declare the $ variable

  let currentProduct = null
  let currentImageIndex = 0
  let productImages = []
  let currentUser = null
  let selectedRating = 0

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (!productId) {
    window.location.href = "index.html"
    return
  }

  // Initialize page
  initializePage()

  function initializePage() {
    checkAuthStatus()
    loadProduct()
    initializeEventListeners()
    updateCartCount()
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

    // Modal close buttons - using event delegation for dynamically added elements
    $(document).on("click", ".close-modal, .cancel-btn", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Close button clicked")
      $("#loginModal").addClass("hidden")
      $("#reviewModal").remove() // Use .remove() for dynamically added modal
    })

    // Login form
    $("#loginForm").submit(handleLogin)

    // Review form submission is now handled by jQuery Validate's submitHandler
    // $(document).on("submit", "#reviewForm", handleReviewSubmit) // This line is no longer needed

    // Star rating - using event delegation
    $(document).on("click", ".star-btn", function () {
      selectedRating = Number.parseInt($(this).data("rating"))
      $("#selectedRating").val(selectedRating)
      updateStarDisplay()
      // Trigger validation for the rating field after selection
      $("#reviewForm").validate().element("#selectedRating")
    })

    // Cart button
    $("#cartBtn").click(() => {
      window.location.href = "cart.html"
    })

    // Modal background clicks
    $(document).on("click", "#loginModal, #reviewModal", function (e) {
      if (e.target === this) {
        console.log("Modal background clicked")
        $(this).addClass("hidden")
        if ($(this).attr("id") === "reviewModal") {
          $(this).remove() // Remove review modal if background clicked
        }
      }
    })

    // Prevent modal content clicks from closing modal
    $(document).on("click", ".modal-content", (e) => {
      e.stopPropagation()
    })
  }

  function loadProduct() {
    $.ajax({
      url: `${API_BASE_URL}/products/${productId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          currentProduct = response.result
          displayProduct(currentProduct)
          loadProductReviews()
        } else {
          showError("Product not found")
          setTimeout(() => (window.location.href = "index.html"), 2000)
        }
      },
      error: (xhr) => {
        console.error("Error loading product:", xhr)
        showError("Failed to load product")
        setTimeout(() => (window.location.href = "index.html"), 2000)
      },
    })
  }

  function displayProduct(product) {
    productImages = product.images || []
    const price = Number.parseFloat(product.price)
    const priceDisplay = price === 0 ? "Free" : `₱${price.toFixed(2)}`
    const stock = Number.parseInt(product.quantity) || 0
    const isPhysical = product.product_type === "physical"
    const isOutOfStock = isPhysical && stock === 0

    // Generate star rating display
    const avgRating = Number.parseFloat(product.average_rating) || 0
    const reviewCount = Number.parseInt(product.review_count) || 0
    const starsHtml = generateStarRating(avgRating)

    const productHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        <!-- Product Images -->
        <div class="space-y-4">
          ${
            productImages.length > 0
              ? `
            <div class="image-carousel bg-gray-300 rounded-lg overflow-hidden">
              <div class="carousel-container" id="carouselContainer">
                ${productImages
                  .map(
                    (img, index) => `
    <div class="carousel-slide">
      <img src="${img}" alt="${product.title}" class="w-full h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity" onclick="openImageModal('${img}')">
    </div>
  `,
                  )
                  .join("")}
              </div>
              ${
                productImages.length > 1
                  ? `
                <button class="carousel-nav prev" onclick="previousImage()">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" onclick="nextImage()">
                  <i class="fas fa-chevron-right"></i>
                </button>
              `
                  : ""
              }
            </div>
            ${
              productImages.length > 1
                ? `
              <div class="carousel-indicators">
                ${productImages
                  .map(
                    (_, index) => `
                  <div class="indicator ${index === 0 ? "active" : ""}" onclick="goToImage(${index})"></div>
                `,
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          `
              : `
            <div class="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <i class="fas fa-gamepad text-6xl text-gray-400"></i>
            </div>
          `
          }
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">${product.title}</h1>
            <div class="flex items-center space-x-4 mb-4">
              <div class="flex items-center space-x-1">
                ${starsHtml}
                <span class="text-sm text-gray-600 ml-2">(${reviewCount} reviews)</span>
              </div>
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                ${product.platform_type || "Unknown Platform"}
              </span>
              ${isOutOfStock ? '<span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">OUT OF STOCK</span>' : ""}
            </div>
            <div class="text-3xl font-bold text-blue-600 mb-4">${priceDisplay}</div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Developer:</strong> ${product.developer || "Unknown"}</div>
            <div><strong>Publisher:</strong> ${product.publisher || "Unknown"}</div>
            <div><strong>Platform:</strong> ${product.platform_type || "Unknown"}</div>
            <div><strong>Type:</strong> ${product.product_type || "Digital"}</div>
            ${isPhysical ? `<div><strong>Stock:</strong> ${stock} available</div>` : ""}
            ${product.release_date ? `<div><strong>Release Date:</strong> ${new Date(product.release_date).toLocaleDateString()}</div>` : ""}
          </div>

          ${
            product.description
              ? `
            <div>
              <h3 class="text-lg font-semibold mb-2">Description</h3>
              <p class="text-gray-600 leading-relaxed">${product.description}</p>
            </div>
          `
              : ""
          }

          <!-- Action Buttons -->
          <div class="space-y-3">
            <div class="flex space-x-3">
              <button id="addToCartBtn" class="flex-1 py-3 px-6 rounded-lg font-semibold transition duration-200 ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }" ${isOutOfStock ? "disabled" : ""}>
                <i class="fas fa-cart-plus mr-2"></i>${isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button id="buyNowBtn" class="flex-1 py-3 px-6 rounded-lg font-semibold transition duration-200 ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }" ${isOutOfStock ? "disabled" : ""}>
                <i class="fas fa-bolt mr-2"></i>${isOutOfStock ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
            <div class="text-center">
              <button id="writeReviewBtn" class="text-blue-600 hover:text-blue-800 font-medium">
                <i class="fas fa-star mr-1"></i>Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="border-t bg-gray-50 p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        <div id="reviewsContainer">
          <!-- Reviews will be loaded here -->
        </div>
      </div>
    `

    $("#productDetail").html(productHtml)

    // Add event listeners for action buttons
    $("#addToCartBtn").click(function () {
      if (isOutOfStock) return
      const $btn = $(this)
      $btn.prop("disabled", true) // Disable button
      addToCart(currentProduct, () => $btn.prop("disabled", false)) // Re-enable in callback
    })

    $("#buyNowBtn").click(function () {
      if (isOutOfStock) return
      const $btn = $(this)
      $btn.prop("disabled", true) // Disable button
      buyNow(currentProduct, () => $btn.prop("disabled", false)) // Re-enable in callback
    })
    $("#writeReviewBtn").click(() => openReviewModal())
  }

  function generateStarRating(rating, size = "text-sm") {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    let starsHtml = ""

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += `<i class="fas fa-star text-yellow-400 ${size}"></i>`
    }

    // Half star
    if (hasHalfStar) {
      starsHtml += `<i class="fas fa-star-half-alt text-yellow-400 ${size}"></i>`
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += `<i class="far fa-star text-gray-300 ${size}"></i>`
    }

    return starsHtml
  }

  // Image carousel functions
  window.nextImage = () => {
    if (currentImageIndex < productImages.length - 1) {
      currentImageIndex++
      updateCarousel()
    }
  }

  window.previousImage = () => {
    if (currentImageIndex > 0) {
      currentImageIndex--
      updateCarousel()
    }
  }

  window.goToImage = (index) => {
    currentImageIndex = index
    updateCarousel()
  }

  function updateCarousel() {
    const container = $("#carouselContainer")
    const translateX = -currentImageIndex * 100
    container.css("transform", `translateX(${translateX}%)`)

    // Update indicators
    $(".indicator").removeClass("active")
    $(`.indicator:eq(${currentImageIndex})`).addClass("active")
  }

  // Add this function after the updateCarousel function
  function openImageModal(imageSrc) {
    Swal.fire({
      html: `<img src="${imageSrc}" alt="Product Image" style="max-width: 100%; max-height: 80vh; object-fit: contain;">`,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      padding: "2rem",
      customClass: {
        popup: "relative",
        closeButton: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10",
      },
      background: "white",
      backdrop: "rgba(0,0,0,0.8)",
    })
  }

  // Make openImageModal globally available
  window.openImageModal = openImageModal

  // Cart functions
  function addToCart(product, callback) {
    if (!currentUser) {
      $("#loginModal").removeClass("hidden")
      if (callback) callback()
      return
    }

    // Check if it's a physical product and if it's out of stock
    const isPhysical = product.product_type === "physical"
    const stock = Number.parseInt(product.quantity) || 0

    if (isPhysical && stock === 0) {
      showError("This product is currently out of stock")
      if (callback) callback()
      return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item) => item.product_id === product.product_id)

    if (existingItem) {
      // Check if adding one more would exceed stock for physical products
      if (isPhysical && existingItem.quantity + 1 > stock) {
        showError(`Only ${stock} items available in stock`)
        if (callback) callback()
        return
      }
      existingItem.quantity += 1
    } else {
      cart.push({
        product_id: product.product_id,
        title: product.title,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        platform_type: product.platform_type,
        product_type: product.product_type,
        quantity: 1,
        stock: stock, // Store stock info for cart validation
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()

    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.title} has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      if (callback) callback()
    })
  }

  function buyNow(product, callback) {
    if (!currentUser) {
      $("#loginModal").removeClass("hidden")
      if (callback) callback()
      return
    }

    // Check if it's a physical product and if it's out of stock
    const isPhysical = product.product_type === "physical"
    const stock = Number.parseInt(product.quantity) || 0

    if (isPhysical && stock === 0) {
      showError("This product is currently out of stock")
      if (callback) callback()
      return
    }

    addToCart(product, () => {
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

  // Review functions
  function loadProductReviews() {
    $.ajax({
      url: `${API_BASE_URL}/reviews?product_id=${productId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          displayReviews(response.reviews)
        }
      },
      error: (xhr) => {
        console.error("Error loading reviews:", xhr)
      },
    })
  }

  function displayReviews(reviews) {
    if (reviews.length === 0) {
      $("#reviewsContainer").html(`
        <div class="text-center py-8">
          <i class="fas fa-star text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">No reviews yet. Be the first to review this game!</p>
        </div>
      `)
      return
    }

    const reviewsHtml = reviews
      .map((review) => {
        const starsHtml = generateStarRating(review.rating)
        const isUserReview = currentUser && currentUser.user_id === review.user_id

        return `
        <div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-semibold text-black">${review.first_name} ${review.last_name}</span>
                <div class="flex items-center space-x-1">
                  ${starsHtml}
                </div>
              </div>
              ${review.review_title ? `<h4 class="font-medium text-gray-800">${review.review_title}</h4>` : ""}
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">${new Date(review.created_at).toLocaleDateString()}</span>
              ${
                isUserReview
                  ? `
                <button class="text-blue-600 hover:text-blue-800 text-sm edit-review" data-review-id="${review.review_id}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800 text-sm delete-review" data-review-id="${review.review_id}">
                  <i class="fas fa-trash"></i>
                </button>
              `
                  : ""
              }
            </div>
          </div>
          ${review.review_text ? `<p class="text-gray-600">${review.review_text}</p>` : ""}
        </div>
      `
      })
      .join("")

    $("#reviewsContainer").html(reviewsHtml)

    // Add event listeners for edit/delete buttons
    $(".edit-review").click(function () {
      const reviewId = $(this).data("review-id")
      editReview(reviewId)
    })

    $(".delete-review").click(function () {
      const reviewId = $(this).data("review-id")
      deleteReview(reviewId)
    })
  }

  function openReviewModal() {
    if (!currentUser) {
      $("#loginModal").removeClass("hidden")
      return
    }

    console.log("Opening review modal for user:", currentUser.user_id, "product:", productId)

    // Check if user purchased this product
    $.ajax({
      url: `${API_BASE_URL}/reviews/check-purchase?user_id=${currentUser.user_id}&product_id=${productId}`,
      method: "GET",
      success: (response) => {
        console.log("Purchase check response:", response)
        if (response.success) {
          if (!response.has_purchased) {
            Swal.fire({
              icon: "warning",
              title: "Purchase Required",
              text: "You can only review products you have purchased and that have been delivered.",
            })
            return
          }

          // Create and show review modal
          showReviewModal(response.existing_review)
        }
      },
      error: (xhr) => {
        console.error("Error checking purchase:", xhr)
        console.error("Response text:", xhr.responseText)
        showError("Failed to verify purchase status. Please try again.")
      },
    })
  }

  function showReviewModal(existingReview = null) {
    const isEdit = existingReview !== null
    const modalTitle = isEdit ? "Edit Your Review" : "Write a Review"

    const modalHtml = `
      <div id="reviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="modal-content bg-black rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 id="reviewModalTitle" class="text-lg font-semibold">${modalTitle}</h3>
            <button class="close-modal text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <form id="reviewForm">
            <input type="hidden" id="reviewId" name="review_id" value="${isEdit ? existingReview.review_id : ""}">
            <input type="hidden" id="reviewProductId" name="product_id" value="${productId}">
            <input type="hidden" id="reviewUserId" name="user_id" value="${currentUser.user_id}">
            <input type="hidden" id="selectedRating" name="rating" value="${isEdit ? existingReview.rating : "5"}">
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-white-700 mb-2">Rating *</label>
              <div class="flex space-x-1">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (rating) => `
                  <button type="button" class="star-btn text-2xl ${isEdit && existingReview.rating >= rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors" data-rating="${rating}">
                    <i class="fas fa-star"></i>
                  </button>
                `,
                  )
                  .join("")}
              </div>
              <!-- Error message for rating will be placed here by jQuery Validate -->
              <div id="rating-error" class="text-red-500 text-xs mt-1"></div>
            </div>
            
            <div class="mb-4">
              <label for="reviewTitle" class="block text-sm font-medium text-white-700 mb-2">Review Title</label>
              <input type="text" id="reviewTitle" name="review_title" 
                     class="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Brief summary of your review"
                     value="${isEdit && existingReview.review_title ? existingReview.review_title : ""}">
            </div>
            
            <div class="mb-6">
              <label for="reviewText" class="block text-sm font-medium text-white-700 mb-2">Review</label>
              <textarea id="reviewText" name="review_text" rows="4"
                        class="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Share your thoughts about this game...">${isEdit && existingReview.review_text ? existingReview.review_text : ""}</textarea>
            </div>
            
            <div class="flex space-x-3">
              <button type="submit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition duration-200">
                ${isEdit ? "Update Review" : "Submit Review"}
              </button>
              <button type="button" class="cancel-btn flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition duration-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `

    // Remove existing modal if any
    $("#reviewModal").remove()

    // Add modal to body
    $("body").append(modalHtml)

    // Set selected rating for edit mode
    if (isEdit) {
      selectedRating = existingReview.rating
      updateStarDisplay()
    } else {
      selectedRating = 5
      updateStarDisplay()
    }

    // Initialize jQuery Validation for the dynamically added review form
    $("#reviewForm").validate({
      rules: {
        rating: {
          required: true,
          min: 1, // Ensure at least 1 star is selected
        },
        review_title: {
          maxlength: 100, // Optional: Add a max length for title
        },
        review_text: {
          maxlength: 1000, // Optional: Add a max length for review text
        },
      },
      messages: {
        rating: {
          required: "Please select a rating.",
          min: "Please select at least one star.",
        },
        review_title: {
          maxlength: "Review title cannot exceed 100 characters.",
        },
        review_text: {
          maxlength: "Review text cannot exceed 1000 characters.",
        },
      },
      errorElement: "div",
      errorClass: "text-red-500 text-xs mt-1",
      highlight: (element, errorClass, validClass) => {
        $(element).addClass("border-red-500")
      },
      unhighlight: (element, errorClass, validClass) => {
        $(element).removeClass("border-red-500")
      },
      errorPlacement: (error, element) => {
        if (element.attr("name") === "rating") {
          error.appendTo("#rating-error") // Place rating error in a specific div
        } else {
          error.insertAfter(element)
        }
      },
      submitHandler: (form) => {
        // This function is called only if the form is valid
        handleReviewSubmit(form) // Call the original submit logic
      },
    })
  }

  function updateStarDisplay() {
    $(".star-btn").each(function (index) {
      const starRating = index + 1
      if (starRating <= selectedRating) {
        $(this).removeClass("text-gray-300").addClass("text-yellow-400")
      } else {
        $(this).removeClass("text-yellow-400").addClass("text-gray-300")
      }
    })
  }

  // Modified handleReviewSubmit to be called by jQuery Validate's submitHandler
  function handleReviewSubmit(form) {
    const formData = new FormData(form)
    const reviewData = {
      user_id: Number.parseInt(formData.get("user_id")),
      product_id: Number.parseInt(formData.get("product_id")),
      rating: selectedRating, // Use selectedRating directly
      review_title: formData.get("review_title"),
      review_text: formData.get("review_text"),
    }

    const reviewId = formData.get("review_id")
    const isEdit = reviewId && reviewId !== ""
    const url = isEdit ? `${API_BASE_URL}/reviews/${reviewId}` : `${API_BASE_URL}/reviews`
    const method = isEdit ? "PUT" : "POST"

    $.ajax({
      url: url,
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(reviewData),
      success: (response) => {
        if (response.success) {
          $("#reviewModal").remove()
          loadProductReviews()
          loadProduct() // Reload to update average rating
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: isEdit ? "Review updated successfully!" : "Review submitted successfully!",
            timer: 1500,
            showConfirmButton: false,
          })
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to submit review"
        showError(error)
      },
    })
  }

  function editReview(reviewId) {
    $.ajax({
      url: `${API_BASE_URL}/reviews/${reviewId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          showReviewModal(response.review)
        }
      },
      error: (xhr) => {
        showError("Failed to load review data")
      },
    })
  }

  function deleteReview(reviewId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${API_BASE_URL}/reviews/${reviewId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          success: (response) => {
            if (response.success) {
              loadProductReviews()
              loadProduct() // Reload to update average rating
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Your review has been deleted.",
                timer: 1500,
                showConfirmButton: false,
              })
            }
          },
          error: (xhr) => {
            const error = xhr.responseJSON?.message || "Failed to delete review"
            showError(error)
          },
        })
      }
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
