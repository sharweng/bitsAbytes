// Global variables
let currentSection = "products"
let authToken = localStorage.getItem("authToken")
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
const API_BASE_URL = "http://localhost:4000/api"

// DataTables instances
let productsTable, reviewsTable, usersTable

// jQuery variable declaration
const $ = window.jQuery

// Initialize the application
$(document).ready(() => {
  initializeAuth()
  initializeEventListeners()
  initializeDataTables()
  loadInitialData()
})

// Authentication functions
function initializeAuth() {
  if (authToken && currentUser.email) {
    showAuthenticatedState()
  } else {
    showUnauthenticatedState()
  }
}

function showAuthenticatedState() {
  $("#loginBtn").addClass("hidden")
  $("#logoutBtn").removeClass("hidden")
  $("#userInfo").removeClass("hidden")
  $("#userName").text(currentUser.first_name || currentUser.email)
}

function showUnauthenticatedState() {
  $("#loginBtn").removeClass("hidden")
  $("#logoutBtn").addClass("hidden")
  $("#userInfo").addClass("hidden")
  authToken = null
  currentUser = {}
  localStorage.removeItem("authToken")
  localStorage.removeItem("currentUser")
}

// Event listeners
function initializeEventListeners() {
  // Dashboard navigation
  $(".dashboard-btn").click(function () {
    $(".dashboard-btn").removeClass("active bg-blue-600 bg-green-600 bg-purple-600")
    $(this).addClass("active")

    const section = $(this).attr("id").replace("Btn", "")
    switchSection(section)
  })

  // Modal controls
  $(".close-modal").click(() => {
    closeAllModals()
  })

  // Click outside modal to close
  $(".fixed").click(function (e) {
    if (e.target === this) {
      closeAllModals()
    }
  })

  // Auth buttons
  $("#loginBtn").click(() => $("#loginModal").removeClass("hidden"))
  $("#logoutBtn").click(logout)

  // Add buttons
  $("#addProductBtn").click(() => openProductModal())
  $("#addReviewBtn").click(() => openReviewModal())

  // Form submissions
  $("#loginForm").submit(handleLogin)
  $("#productForm").submit(handleProductSubmit)
  $("#reviewForm").submit(handleReviewSubmit)
}

// Section switching
function switchSection(section) {
  $(".section").addClass("hidden")
  $(`#${section}Section`).removeClass("hidden")
  currentSection = section

  // Update active button styling
  $(".dashboard-btn").removeClass("active")
  $(`#${section}Btn`).addClass("active")

  // Add appropriate background color based on section
  $(".dashboard-btn").removeClass("bg-blue-600 bg-green-600 bg-purple-600")
  if (section === "products") {
    $("#productsBtn").addClass("bg-blue-600")
  } else if (section === "reviews") {
    $("#reviewsBtn").addClass("bg-green-600")
  } else if (section === "users") {
    $("#usersBtn").addClass("bg-purple-600")
  }
}

// DataTables initialization
function initializeDataTables() {
  // Products table
  productsTable = $("#productsTable").DataTable({
    responsive: true,
    pageLength: 10,
    order: [[0, "desc"]],
    columnDefs: [
      { targets: -1, orderable: false }, // Actions column
    ],
  })

  // Reviews table
  reviewsTable = $("#reviewsTable").DataTable({
    responsive: true,
    pageLength: 10,
    order: [[0, "desc"]],
    columnDefs: [
      { targets: -1, orderable: false }, // Actions column
    ],
  })

  // Users table
  usersTable = $("#usersTable").DataTable({
    responsive: true,
    pageLength: 10,
    order: [[0, "desc"]],
    columnDefs: [
      { targets: -1, orderable: false }, // Actions column
    ],
  })
}

// Data loading functions
function loadInitialData() {
  loadProducts()
  loadReviews()
  loadUsers()
}

function loadProducts() {
  showLoading()
  $.ajax({
    url: `${API_BASE_URL}/products`,
    method: "GET",
    success: (response) => {
      populateProductsTable(response.rows || [])
    },
    error: (xhr) => {
      showError("Failed to load products")
      console.error("Error loading products:", xhr)
    },
    complete: () => {
      hideLoading()
    },
  })
}

function loadReviews() {
  $.ajax({
    url: `${API_BASE_URL}/reviews`,
    method: "GET",
    success: (response) => {
      populateReviewsTable(response.reviews || [])
    },
    error: (xhr) => {
      showError("Failed to load reviews")
      console.error("Error loading reviews:", xhr)
    },
  })
}

function loadUsers() {
  $.ajax({
    url: `${API_BASE_URL}/users`,
    method: "GET",
    success: (response) => {
      populateUsersTable(response.users || [])
    },
    error: (xhr) => {
      showError("Failed to load users")
      console.error("Error loading users:", xhr)
    },
  })
}

// Table population functions
function populateProductsTable(products) {
  productsTable.clear()

  products.forEach((product) => {
    const actions = `
            <div class="flex space-x-2">
                <button onclick="viewProduct(${product.product_id})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editProduct(${product.product_id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct(${product.product_id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

    productsTable.row.add([
      product.product_id,
      product.title,
      `$${Number.parseFloat(product.price).toFixed(2)}`,
      product.platform_type || "N/A",
      product.product_type || "N/A",
      product.quantity || 0,
      actions,
    ])
  })

  productsTable.draw()
}

function populateReviewsTable(reviews) {
  reviewsTable.clear()

  reviews.forEach((review) => {
    const actions = `
            <div class="flex space-x-2">
                <button onclick="viewReview(${review.review_id})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editReview(${review.review_id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteReview(${review.review_id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating)
    const createdDate = new Date(review.created_at).toLocaleDateString()

    reviewsTable.row.add([
      review.review_id,
      review.product_title || "N/A",
      `${review.first_name} ${review.last_name}`,
      `<span class="text-yellow-500">${stars}</span> (${review.rating})`,
      review.review_title || "No title",
      createdDate,
      actions,
    ])
  })

  reviewsTable.draw()
}

function populateUsersTable(users) {
  usersTable.clear()

  users.forEach((user) => {
    const actions = `
            <div class="flex space-x-2">
                <button onclick="viewUser(${user.user_id})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editUser(${user.user_id})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                    <i class="fas fa-edit"></i>
                </button>
                ${
                  user.deleted
                    ? `<button onclick="reactivateUser(${user.user_id})" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm">
                        <i class="fas fa-user-check"></i>
                    </button>`
                    : `<button onclick="deactivateUser(${user.user_id})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">
                        <i class="fas fa-user-times"></i>
                    </button>`
                }
            </div>
        `

    const status = user.deleted
      ? '<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Deactivated</span>'
      : '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>'

    const createdDate = new Date(user.created_at).toLocaleDateString()

    usersTable.row.add([
      user.user_id,
      user.email,
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A",
      user.role || "customer",
      status,
      createdDate,
      actions,
    ])
  })

  usersTable.draw()
}

// Authentication handlers
function handleLogin(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  showLoading()
  $.ajax({
    url: `${API_BASE_URL}/users/login`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(loginData),
    success: (response) => {
      if (response.success) {
        authToken = response.token
        currentUser = response.user
        localStorage.setItem("authToken", authToken)
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
        showAuthenticatedState()
        closeAllModals()
        showSuccess("Login successful!")
      }
    },
    error: (xhr) => {
      const error = xhr.responseJSON?.message || "Login failed"
      showError(error)
    },
    complete: () => {
      hideLoading()
    },
  })
}

function logout() {
  showUnauthenticatedState()
  showSuccess("Logged out successfully!")
}

// Product CRUD operations
function openProductModal(productId = null) {
  if (productId) {
    $("#productModalTitle").text("Edit Product")
    loadProductData(productId)
  } else {
    $("#productModalTitle").text("Add Product")
    $("#productForm")[0].reset()
    $('input[name="product_id"]').val("")
  }
  $("#productModal").removeClass("hidden")
}

function loadProductData(productId) {
  $.ajax({
    url: `${API_BASE_URL}/products/${productId}`,
    method: "GET",
    success: (response) => {
      if (response.success) {
        const product = response.result
        $('input[name="product_id"]').val(product.product_id)
        $('input[name="title"]').val(product.title)
        $('textarea[name="description"]').val(product.description)
        $('input[name="price"]').val(product.price)
        $('select[name="plat_id"]').val(product.plat_id)
        $('select[name="ptype_id"]').val(product.ptype_id)
        $('input[name="quantity"]').val(product.quantity)
        $('input[name="release_date"]').val(product.release_date)
        $('input[name="developer"]').val(product.developer)
        $('input[name="publisher"]').val(product.publisher)
      }
    },
    error: (xhr) => {
      showError("Failed to load product data")
    },
  })
}

function handleProductSubmit(e) {
  e.preventDefault()

  if (!authToken) {
    showError("Please login to perform this action")
    return
  }

  const formData = new FormData(e.target)
  const productId = formData.get("product_id")
  const isEdit = productId && productId !== ""

  showLoading()
  $.ajax({
    url: `${API_BASE_URL}/products${isEdit ? `/${productId}` : ""}`,
    method: isEdit ? "PUT" : "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    data: formData,
    processData: false,
    contentType: false,
    success: (response) => {
      if (response.success) {
        closeAllModals()
        loadProducts()
        showSuccess(`Product ${isEdit ? "updated" : "created"} successfully!`)
      }
    },
    error: (xhr) => {
      const error = xhr.responseJSON?.error || `Failed to ${isEdit ? "update" : "create"} product`
      showError(error)
    },
    complete: () => {
      hideLoading()
    },
  })
}

function viewProduct(productId) {
  $.ajax({
    url: `${API_BASE_URL}/products/${productId}`,
    method: "GET",
    success: (response) => {
      if (response.success) {
        const product = response.result
        const content = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong>ID:</strong> ${product.product_id}</div>
                        <div><strong>Title:</strong> ${product.title}</div>
                        <div><strong>Price:</strong> $${Number.parseFloat(product.price).toFixed(2)}</div>
                        <div><strong>Platform:</strong> ${product.platform_type || "N/A"}</div>
                        <div><strong>Type:</strong> ${product.product_type || "N/A"}</div>
                        <div><strong>Stock:</strong> ${product.quantity || 0}</div>
                        <div><strong>Developer:</strong> ${product.developer || "N/A"}</div>
                        <div><strong>Publisher:</strong> ${product.publisher || "N/A"}</div>
                        <div><strong>Release Date:</strong> ${product.release_date || "N/A"}</div>
                        <div class="md:col-span-2"><strong>Description:</strong> ${product.description || "No description"}</div>
                        ${
                          product.images && product.images.length > 0
                            ? `
                            <div class="md:col-span-2">
                                <strong>Images:</strong>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    ${product.images.map((img) => `<img src="${API_BASE_URL.replace("/api", "")}${img}" alt="Product image" class="w-20 h-20 object-cover rounded border">`).join("")}
                                </div>
                            </div>
                        `
                            : ""
                        }
                    </div>
                `
        $("#viewModalTitle").text("Product Details")
        $("#viewModalContent").html(content)
        $("#viewModal").removeClass("hidden")
      }
    },
    error: (xhr) => {
      showError("Failed to load product details")
    },
  })
}

function editProduct(productId) {
  openProductModal(productId)
}

function deleteProduct(productId) {
  if (!authToken) {
    showError("Please login to perform this action")
    return
  }

  if (confirm("Are you sure you want to delete this product?")) {
    showLoading()
    $.ajax({
      url: `${API_BASE_URL}/products/${productId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      success: (response) => {
        if (response.success) {
          loadProducts()
          showSuccess("Product deleted successfully!")
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.error || "Failed to delete product"
        showError(error)
      },
      complete: () => {
        hideLoading()
      },
    })
  }
}

// Review CRUD operations
function openReviewModal(reviewId = null) {
  // Load products and users for dropdowns
  loadProductsForDropdown()
  loadUsersForDropdown()

  if (reviewId) {
    $("#reviewModalTitle").text("Edit Review")
    loadReviewData(reviewId)
  } else {
    $("#reviewModalTitle").text("Add Review")
    $("#reviewForm")[0].reset()
    $('input[name="review_id"]').val("")
  }
  $("#reviewModal").removeClass("hidden")
}

function loadProductsForDropdown() {
  $.ajax({
    url: `${API_BASE_URL}/products`,
    method: "GET",
    success: (response) => {
      const select = $('select[name="product_id"]')
      select.find("option:not(:first)").remove()

      if (response.rows) {
        response.rows.forEach((product) => {
          select.append(`<option value="${product.product_id}">${product.title}</option>`)
        })
      }
    },
  })
}

function loadUsersForDropdown() {
  $.ajax({
    url: `${API_BASE_URL}/users`,
    method: "GET",
    success: (response) => {
      const select = $('select[name="user_id"]')
      select.find("option:not(:first)").remove()

      if (response.users) {
        response.users.forEach((user) => {
          const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email
          select.append(`<option value="${user.user_id}">${name}</option>`)
        })
      }
    },
  })
}

function loadReviewData(reviewId) {
  $.ajax({
    url: `${API_BASE_URL}/reviews/${reviewId}`,
    method: "GET",
    success: (response) => {
      if (response.success) {
        const review = response.review
        $('input[name="review_id"]').val(review.review_id)
        $('select[name="product_id"]').val(review.product_id)
        $('select[name="user_id"]').val(review.user_id)
        $('select[name="rating"]').val(review.rating)
        $('input[name="review_title"]').val(review.review_title)
        $('textarea[name="review_text"]').val(review.review_text)
      }
    },
    error: (xhr) => {
      showError("Failed to load review data")
    },
  })
}

function handleReviewSubmit(e) {
  e.preventDefault()

  if (!authToken) {
    showError("Please login to perform this action")
    return
  }

  const formData = new FormData(e.target)
  const reviewId = formData.get("review_id")
  const isEdit = reviewId && reviewId !== ""

  const reviewData = {
    product_id: formData.get("product_id"),
    user_id: formData.get("user_id"),
    rating: Number.parseInt(formData.get("rating")),
    review_title: formData.get("review_title"),
    review_text: formData.get("review_text"),
  }

  showLoading()
  $.ajax({
    url: `${API_BASE_URL}/reviews${isEdit ? `/${reviewId}` : ""}`,
    method: isEdit ? "PUT" : "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(reviewData),
    success: (response) => {
      if (response.success) {
        closeAllModals()
        loadReviews()
        showSuccess(`Review ${isEdit ? "updated" : "created"} successfully!`)
      }
    },
    error: (xhr) => {
      const error = xhr.responseJSON?.message || `Failed to ${isEdit ? "update" : "create"} review`
      showError(error)
    },
    complete: () => {
      hideLoading()
    },
  })
}

function viewReview(reviewId) {
  $.ajax({
    url: `${API_BASE_URL}/reviews/${reviewId}`,
    method: "GET",
    success: (response) => {
      if (response.success) {
        const review = response.review
        const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating)
        const content = `
                    <div class="space-y-4">
                        <div><strong>Review ID:</strong> ${review.review_id}</div>
                        <div><strong>Product:</strong> ${review.product_title}</div>
                        <div><strong>User:</strong> ${review.first_name} ${review.last_name} (${review.email})</div>
                        <div><strong>Rating:</strong> <span class="text-yellow-500">${stars}</span> (${review.rating}/5)</div>
                        <div><strong>Title:</strong> ${review.review_title || "No title"}</div>
                        <div><strong>Review:</strong> ${review.review_text || "No review text"}</div>
                        <div><strong>Created:</strong> ${new Date(review.created_at).toLocaleString()}</div>
                        <div><strong>Updated:</strong> ${new Date(review.updated_at).toLocaleString()}</div>
                    </div>
                `
        $("#viewModalTitle").text("Review Details")
        $("#viewModalContent").html(content)
        $("#viewModal").removeClass("hidden")
      }
    },
    error: (xhr) => {
      showError("Failed to load review details")
    },
  })
}

function editReview(reviewId) {
  openReviewModal(reviewId)
}

function deleteReview(reviewId) {
  if (!authToken) {
    showError("Please login to perform this action")
    return
  }

  if (confirm("Are you sure you want to delete this review?")) {
    showLoading()
    $.ajax({
      url: `${API_BASE_URL}/reviews/${reviewId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      success: (response) => {
        if (response.success) {
          loadReviews()
          showSuccess("Review deleted successfully!")
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to delete review"
        showError(error)
      },
      complete: () => {
        hideLoading()
      },
    })
  }
}

// User operations
function viewUser(userId) {
  $.ajax({
    url: `${API_BASE_URL}/users/profile/${userId}`,
    method: "GET",
    success: (response) => {
      if (response.success) {
        const user = response.user
        const content = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong>User ID:</strong> ${user.user_id}</div>
                        <div><strong>Email:</strong> ${user.email}</div>
                        <div><strong>First Name:</strong> ${user.first_name || "N/A"}</div>
                        <div><strong>Last Name:</strong> ${user.last_name || "N/A"}</div>
                        <div><strong>Contact:</strong> ${user.contact_number || "N/A"}</div>
                        <div><strong>Role:</strong> ${user.role}</div>
                        <div><strong>Created:</strong> ${new Date(user.created_at).toLocaleString()}</div>
                        ${
                          user.image_url
                            ? `
                            <div class="md:col-span-2">
                                <strong>Profile Image:</strong><br>
                                <img src="${API_BASE_URL.replace("/api", "")}${user.image_url}" alt="Profile" class="w-32 h-32 object-cover rounded border mt-2">
                            </div>
                        `
                            : ""
                        }
                    </div>
                `
        $("#viewModalTitle").text("User Details")
        $("#viewModalContent").html(content)
        $("#viewModal").removeClass("hidden")
      }
    },
    error: (xhr) => {
      showError("Failed to load user details")
    },
  })
}

function editUser(userId) {
  // For now, just show a message. You can implement a user edit modal similar to products
  showError("User editing functionality not implemented yet")
}

function deactivateUser(userId) {
  if (confirm("Are you sure you want to deactivate this user?")) {
    showLoading()
    $.ajax({
      url: `${API_BASE_URL}/users/deactivate/${userId}`,
      method: "PUT",
      success: (response) => {
        if (response.success) {
          loadUsers()
          showSuccess("User deactivated successfully!")
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to deactivate user"
        showError(error)
      },
      complete: () => {
        hideLoading()
      },
    })
  }
}

function reactivateUser(userId) {
  if (confirm("Are you sure you want to reactivate this user?")) {
    showLoading()
    $.ajax({
      url: `${API_BASE_URL}/users/reactivate/${userId}`,
      method: "PUT",
      success: (response) => {
        if (response.success) {
          loadUsers()
          showSuccess("User reactivated successfully!")
        }
      },
      error: (xhr) => {
        const error = xhr.responseJSON?.message || "Failed to reactivate user"
        showError(error)
      },
      complete: () => {
        hideLoading()
      },
    })
  }
}

// Utility functions
function closeAllModals() {
  $(".fixed").addClass("hidden")
}

function showLoading() {
  $("#loadingSpinner").removeClass("hidden")
}

function hideLoading() {
  $("#loadingSpinner").addClass("hidden")
}

function showSuccess(message) {
  // Create a temporary success notification
  const notification = $(`
        <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <i class="fas fa-check-circle mr-2"></i>${message}
        </div>
    `)

  $("body").append(notification)

  setTimeout(() => {
    notification.fadeOut(() => notification.remove())
  }, 3000)
}

function showError(message) {
  // Create a temporary error notification
  const notification = $(`
        <div class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <i class="fas fa-exclamation-circle mr-2"></i>${message}
        </div>
    `)

  $("body").append(notification)

  setTimeout(() => {
    notification.fadeOut(() => notification.remove())
  }, 5000)
}
