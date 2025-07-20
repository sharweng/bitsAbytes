const $ = window.jQuery // Declare the $ variable

$(document).ready(() => {
  const API_BASE_URL = window.API_BASE_URL || "http://localhost:4000/api"
  let productsTable
  let isEditMode = false

  // Initialize DataTable
  function initializeProductsTable() {
    productsTable = $("#productsTable").DataTable({
      ajax: {
        url: `${API_BASE_URL}/products?limit=1000&page=1`, // Get all products for admin dashboard
        headers: window.getAuthHeaders ? window.getAuthHeaders() : {},
        dataSrc: (json) => {
          console.log("DataTable received:", json)
          // Handle both old and new API response formats
          if (json.success && json.products) {
            return json.products // New format
          } else if (json.rows) {
            return json.rows // Old format (fallback)
          } else if (json.success && json.rows) {
            return json.rows // Another possible format
          }
          return [] // Empty array if no data
        },
        error: (xhr, error, code) => {
          console.error("DataTable AJAX error:", xhr, error, code)
          console.error("Response:", xhr.responseText)
        },
      },
      columns: [
        { data: "product_id" },
        {
          data: "images",
          render: (data) => {
            if (data && data.length > 0) {
              const imageCount = data.length
              const firstImage = `<img src="${data[0]}" alt="Product" class="w-12 h-12 object-cover rounded">`

              if (imageCount > 1) {
                return `<div class="relative inline-block">${firstImage}<span class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">+${imageCount - 1}</span></div>`
              }
              return firstImage
            }
            return '<div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center"><i class="fas fa-image text-gray-400"></i></div>'
          },
        },
        { data: "title" },
        {
          data: "price",
          render: (data) => `$${Number.parseFloat(data).toFixed(2)}`,
        },
        {
          data: "platform_type",
          render: (data) => data || "N/A",
        },
        {
          data: "product_type",
          render: (data) => data || "N/A",
        },
        {
          data: "quantity",
          render: (data, type, row) => {
            // Display N/A if product_type is 'digital'
            if (row.product_type && row.product_type.toLowerCase() === "digital") {
              return "N/A"
            }
            return data || 0
          },
        },
        {
          data: null,
          render: (data) => `
        <button class="text-green-600 hover:text-green-800 mr-2 view-product" data-id="${data.product_id}" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="text-blue-600 hover:text-blue-800 mr-2 edit-product" data-id="${data.product_id}" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="text-red-600 hover:text-red-800 delete-product" data-id="${data.product_id}" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      `,
        },
      ],
      responsive: true,
      pageLength: 25,
    })
  }

  // View product details
  $(document).on("click", ".view-product", function () {
    const productId = $(this).data("id")

    $.ajax({
      url: `${API_BASE_URL}/products/${productId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const product = response.result

          // Create images gallery
          let imagesHtml = ""
          if (product.images && product.images.length > 0) {
            imagesHtml = `
            <div class="mb-4">
              <h4 class="font-semibold mb-2">Product Images:</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                ${product.images
                  .map(
                    (img) =>
                      `<img src="${img}" alt="Product image" class="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-75" onclick="openImageModal('${img}')">`,
                  )
                  .join("")}
              </div>
            </div>
          `
          }

          const content = `
          <div class="space-y-4">
            ${imagesHtml}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Product ID:</strong> ${product.product_id}</div>
              <div><strong>Title:</strong> ${product.title}</div>
              <div><strong>Price:</strong> $${Number.parseFloat(product.price).toFixed(2)}</div>
              <div><strong>Platform:</strong> ${product.platform_type || "N/A"}</div>
              <div><strong>Type:</strong> ${product.product_type || "N/A"}</div>
              <div><strong>Stock:</strong> ${product.product_type && product.product_type.toLowerCase() === "digital" ? "N/A" : product.quantity || 0}</div>
              <div><strong>Developer:</strong> ${product.developer || "N/A"}</div>
              <div><strong>Publisher:</strong> ${product.publisher || "N/A"}</div>
              <div><strong>Release Date:</strong> ${product.releaseDate ? new Date(product.releaseDate).toLocaleDateString() : "N/A"}</div>
              <div class="md:col-span-2"><strong>Description:</strong> ${product.description || "No description available"}</div>
            </div>
          </div>
        `

          window.Swal.fire({
            title: "Product Details",
            html: content,
            width: "800px",
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
              popup: "text-left",
            },
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading product:", xhr)
        window.Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product details",
        })
      },
    })
  })

  // Function to open image in modal
  function openImageModal(imageSrc) {
    window.Swal.fire({
      imageUrl: imageSrc,
      imageAlt: "Product Image",
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      padding: "1rem",
    })
  }

  // Load platform types for dropdown
  function loadPlatformTypes() {
    $.ajax({
      url: `${API_BASE_URL}/products/platforms`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const select = $("#platId")
          select.find("option:not(:first)").remove()

          response.platforms.forEach((platform) => {
            select.append(`<option value="${platform.plat_id}">${platform.description}</option>`)
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading platform types:", xhr)
      },
    })
  }

  // Load product types for dropdown
  function loadProductTypes() {
    $.ajax({
      url: `${API_BASE_URL}/products/types`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const select = $("#ptypeId")
          select.find("option:not(:first)").remove()

          response.productTypes.forEach((type) => {
            select.append(`<option value="${type.ptype_id}">${type.description}</option>`)
          })
          // Trigger change to set initial quantity field visibility
          handleProductTypeChange()
        }
      },
      error: (xhr) => {
        console.error("Error loading product types:", xhr)
      },
    })
  }

  // Handle product type change to show/hide quantity
  function handleProductTypeChange() {
    const selectedPtypeId = $("#ptypeId").val()
    const $quantityGroup = $("#quantityGroup")
    const $quantityInput = $("#quantity")

    // ptype_id 2 is 'physical' based on schema.sql
    if (selectedPtypeId === "2") {
      $quantityGroup.removeClass("hidden")
      $quantityInput.prop("required", true)
    } else {
      $quantityGroup.addClass("hidden")
      $quantityInput.prop("required", false)
      $quantityInput.val(0) // Reset quantity to 0 for digital products
    }
    // Re-validate quantity field if its visibility changes
    $("#productForm").validate().element("#quantity")
  }

  // Add product button
  $("#addProductBtn").on("click", () => {
    isEditMode = false
    $("#modalTitle").text("Add Product")
    $("#submitProductBtn").text("Add Product")
    $("#productForm")[0].reset()
    $("#productId").val("")

    // Clear previous validation errors
    $("#productForm").validate().resetForm()
    $(".error").removeClass("error") // Remove error classes from inputs

    // Load dropdowns and set initial quantity field visibility
    loadPlatformTypes()
    loadProductTypes() // This will call handleProductTypeChange

    $("#productModal").removeClass("hidden").addClass("flex")
  })

  // Edit product
  $(document).on("click", ".edit-product", function () {
    const productId = $(this).data("id")
    isEditMode = true

    // Clear previous validation errors
    $("#productForm").validate().resetForm()
    $(".error").removeClass("error") // Remove error classes from inputs

    // Load dropdowns first
    loadPlatformTypes()
    loadProductTypes() // This will call handleProductTypeChange

    $.ajax({
      url: `${API_BASE_URL}/products/${productId}`,
      method: "GET",
      success: (response) => {
        console.log("Product response:", response)
        if (response.success) {
          const product = response.result
          $("#modalTitle").text("Edit Product")
          $("#submitProductBtn").text("Update Product")
          $("#productId").val(product.product_id)
          $("#title").val(product.title)
          $("#description").val(product.description)
          $("#price").val(product.price)
          $("#quantity").val(product.quantity)
          $("#developer").val(product.developer)
          $("#publisher").val(product.publisher)
          $("#releaseDate").val(product.releaseDate ? product.releaseDate.split("T")[0] : "")

          // Set platform and product type after a short delay to ensure options are loaded
          setTimeout(() => {
            $("#platId").val(product.plat_id)
            $("#ptypeId").val(product.ptype_id)
            handleProductTypeChange() // Re-evaluate quantity field visibility based on loaded type
          }, 200)

          $("#productModal").removeClass("hidden").addClass("flex")
        }
      },
      error: (xhr) => {
        console.error("Error loading product:", xhr)
        const response = xhr.responseJSON
        window.Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.error || "Failed to load product data",
        })
      },
    })
  })

  // Listen for changes on the product type dropdown
  $("#ptypeId").on("change", handleProductTypeChange)

  // Initialize jQuery Validation for product form
  $("#productForm").validate({
    rules: {
      title: {
        required: true,
        minlength: 3,
      },
      price: {
        required: true,
        number: true,
        min: 0,
      },
      description: {
        minlength: 5,
      },
      plat_id: {
        required: true,
      },
      ptype_id: {
        required: true,
      },
      quantity: {
        required: {
          depends: (element) => {
            // Quantity is required only if product type is 'physical' (ptype_id = 2)
            return $("#ptypeId").val() === "2"
          },
        },
        number: true,
        min: 0,
      },
      developer: {
        minlength: 3,
      },
      publisher: {
        minlength: 3,
      },
      releaseDate: {
        required: true, // Make release date required
      },
    },
    messages: {
      title: {
        required: "Please enter a product title.",
        minlength: "Title must be at least 3 characters.",
      },
      price: {
        required: "Please enter a price.",
        number: "Please enter a valid number for price.",
        min: "Price cannot be negative.",
      },
      description: {
        minlength: "Description must be at least 5 characters.",
      },
      plat_id: {
        required: "Please select a platform.",
      },
      ptype_id: {
        required: "Please select a product type.",
      },
      quantity: {
        required: "Quantity is required for physical products.",
        number: "Please enter a valid number for quantity.",
        min: "Quantity cannot be negative.",
      },
      developer: {
        minlength: "Description must be at least 3 characters.",
      },
      publisher: {
        minlength: "Description must be at least 3 characters.",
      },
      releaseDate: {
        required: "Please enter a release date.", // Message for required release date
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
    submitHandler: (form) => {
      // This function is called only if the form is valid
      const formData = new FormData(form)
      const productId = $("#productId").val()

      const url = isEditMode ? `${API_BASE_URL}/products/${productId}` : `${API_BASE_URL}/products`
      const method = isEditMode ? "PUT" : "POST"

      if (window.makeAuthenticatedRequest) {
        window.makeAuthenticatedRequest({
          url: url,
          method: method,
          data: formData,
          processData: false,
          contentType: false,
          success: (response) => {
            if (response.success) {
              window.Swal.fire({
                icon: "success",
                title: "Success!",
                text: isEditMode ? "Product updated successfully" : "Product added successfully",
                timer: 1500,
                showConfirmButton: false,
              })
              $("#productModal").addClass("hidden").removeClass("flex")
              productsTable.ajax.reload()
            }
          },
          error: (xhr) => {
            console.error("Product form error:", xhr)
            const response = xhr.responseJSON
            let errorMessage = "An error occurred"

            if (response) {
              errorMessage = response.error || response.message || errorMessage
              if (response.details) {
                console.error("Error details:", response.details)
                errorMessage += ": " + (response.details.message || response.details)
              }
            }

            window.Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
            })
          },
        })
      }
    },
  })

  // Delete product
  $(document).on("click", ".delete-product", function () {
    const productId = $(this).data("id")

    window.Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed && window.makeAuthenticatedRequest) {
        window.makeAuthenticatedRequest({
          url: `${API_BASE_URL}/products/${productId}`,
          method: "DELETE",
          success: (response) => {
            if (response.success) {
              window.Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: response.message,
                timer: 1500,
                showConfirmButton: false,
              })
              productsTable.ajax.reload()
            }
          },
          error: (xhr) => {
            const response = xhr.responseJSON
            window.Swal.fire({
              icon: "error",
              title: "Error",
              text: response?.error || "Failed to delete product",
            })
          },
        })
      }
    })
  })

  // Modal controls
  $("#closeProductModal, #cancelProductBtn").on("click", () => {
    $("#productModal").addClass("hidden").removeClass("flex")
  })

  // Initialize
  if (window.checkAuth && window.checkAuth()) {
    console.log("Initializing products table...")
    initializeProductsTable()
  } else {
    console.error("checkAuth function not available")
  }

  // Make openImageModal globally available
  window.openImageModal = openImageModal
})
