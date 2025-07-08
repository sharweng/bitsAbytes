const $ = require("jquery")
const API_BASE_URL = "https://localhost:4000/api"
const Swal = require("sweetalert2")
const makeAuthenticatedRequest = require("./makeAuthenticatedRequest")
const checkAuth = require("./checkAuth")

$(document).ready(() => {
  let productsTable
  let isEditMode = false

  // Initialize DataTable
  function initializeProductsTable() {
    productsTable = $("#productsTable").DataTable({
      ajax: {
        url: `${API_BASE_URL}/products`,
        dataSrc: "rows",
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
        Swal.fire({
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

    makeAuthenticatedRequest({
      url: url,
      method: method,
      data: formData,
      processData: false,
      contentType: false,
      success: (response) => {
        if (response.success) {
          Swal.fire({
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error || "An error occurred",
        })
      },
    })
  })

  // Delete product
  $(document).on("click", ".delete-product", function () {
    const productId = $(this).data("id")

    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAuthenticatedRequest({
          url: `${API_BASE_URL}/products/${productId}`,
          method: "DELETE",
          success: (response) => {
            if (response.success) {
              Swal.fire({
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
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.error || "Failed to delete product",
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
  if (checkAuth()) {
    initializeProductsTable()
  }
})
