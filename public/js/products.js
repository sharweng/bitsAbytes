const $ = window.jQuery // Declare the $ variable

$(document).ready(() => {
  const API_BASE_URL = window.API_BASE_URL || "http://localhost:4000/api"
  let productsTable
  let isEditMode = false

  // Initialize DataTable
  function initializeProductsTable() {
    productsTable = $("#productsTable").DataTable({
      ajax: {
        url: `${API_BASE_URL}/products`,
        dataSrc: "rows",
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
              return `<img src="${API_BASE_URL.replace("/api", "")}/${data[0]}" alt="Product" class="w-12 h-12 object-cover rounded">`
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
          render: (data) => data || 0,
        },
        {
          data: null,
          render: (data) => `
                            <button class="text-blue-600 hover:text-blue-800 mr-2 edit-product" data-id="${data.product_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800 delete-product" data-id="${data.product_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        `,
        },
      ],
      responsive: true,
      pageLength: 25,
    })
  }

  // Add product button
  $("#addProductBtn").on("click", () => {
    isEditMode = false
    $("#modalTitle").text("Add Product")
    $("#submitProductBtn").text("Add Product")
    $("#productForm")[0].reset()
    $("#productId").val("")
    $("#productModal").removeClass("hidden").addClass("flex")
  })

  // Edit product
  $(document).on("click", ".edit-product", function () {
    const productId = $(this).data("id")
    isEditMode = true

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
          $("#platId").val(product.plat_id)
          $("#ptypeId").val(product.ptype_id)
          $("#quantity").val(product.quantity)
          $("#developer").val(product.developer)
          $("#publisher").val(product.publisher)
          $("#releaseDate").val(product.release_date ? product.release_date.split("T")[0] : "")
          $("#productModal").removeClass("hidden").addClass("flex")
        }
      },
      error: (xhr) => {
        console.error("Error loading product:", xhr)
        window.Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product data",
        })
      },
    })
  })

  // Submit product form
  $("#productForm").on("submit", function (e) {
    e.preventDefault()

    const formData = new FormData(this)
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
          const response = xhr.responseJSON
          window.Swal.fire({
            icon: "error",
            title: "Error",
            text: response?.error || "An error occurred",
          })
        },
      })
    }
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
})
