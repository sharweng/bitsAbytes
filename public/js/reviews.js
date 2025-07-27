$(document).ready(() => {
  const API_BASE_URL = window.API_BASE_URL || "http://localhost:4000/api"
  let reviewsTable
  const $ = window.$
  const Swal = window.Swal

  // Load navbar
  $('#navbar-container').load('navbar.html')

  // Initialize DataTable
  function initializeReviewsTable() {
    // Check if table already exists and destroy it first
    if ($.fn.DataTable.isDataTable("#reviewsTable")) {
      reviewsTable.destroy()
    }

    reviewsTable = $("#reviewsTable").DataTable({
      ajax: {
        url: `${API_BASE_URL}/reviews`,
        dataSrc: "reviews",
        error: (xhr, error, code) => {
          console.error("DataTable AJAX error:", xhr, error, code)
          // Show user-friendly error message
          Swal.fire({
            icon: 'error',
            title: 'Error loading reviews',
            text: 'Failed to load reviews data. Please try again later.'
          })
        },
      },
      columns: [
        { data: "review_id" },
        {
          data: null,
          render: (data) => {
            const firstName = data.first_name || ""
            const lastName = data.last_name || ""
            const name = `${firstName} ${lastName}`.trim()
            return name || data.email
          },
        },
        { data: "product_title" },
        {
          data: "rating",
          render: (data) => {
            let stars = ""
            for (let i = 1; i <= 5; i++) {
              stars += i <= data
                ? '<i class="fas fa-star text-yellow-400"></i>'
                : '<i class="far fa-star text-gray-300"></i>'
            }
            return stars
          },
        },
        {
          data: "review_title",
          render: (data) => data || "N/A",
        },
        {
          data: "review_text",
          render: (data) => {
            if (!data) return "N/A"
            return data.length > 50 ? data.substring(0, 50) + "..." : data
          },
        },
        {
          data: "created_at",
          type: "date",
          render: (data) => new Date(data).toLocaleDateString(),
        },
        {
          data: null,
          render: (data) => `
            <button class="text-blue-600 hover:text-blue-800 mr-2 view-review" data-id="${data.review_id}" title="View Full Review">
              <i class="fas fa-eye"></i>
            </button>
            <button class="text-red-600 hover:text-red-800 delete-review" data-id="${data.review_id}" title="Delete Review">
              <i class="fas fa-trash"></i>
            </button>
          `,
        },
      ],
      responsive: true,
      pageLength: 25,
      order: [[6, "desc"]], // Sort by date (column 6) descending
      autoWidth: false,
      initComplete: function() {
        // Add any initialization complete logic here
      }
    })
  }

  // Filter reviews by rating
  $("#ratingFilter").on("change", function () {
    const rating = $(this).val()
    let url = `${API_BASE_URL}/reviews`

    if (rating) {
      url += `?rating_filter=${rating}`
    }

    reviewsTable.ajax.url(url).load()
  })

  // View full review
  $(document).on("click", ".view-review", function () {
    const reviewId = $(this).data("id")

    $.ajax({
      url: `${API_BASE_URL}/reviews/${reviewId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const review = response.review
          const firstName = review.first_name || ""
          const lastName = review.last_name || ""
          const userName = `${firstName} ${lastName}`.trim() || review.email

          let stars = ""
          for (let i = 1; i <= 5; i++) {
            stars += i <= review.rating
              ? '<i class="fas fa-star text-yellow-400"></i>'
              : '<i class="far fa-star text-gray-300"></i>'
          }

          Swal.fire({
            title: review.review_title || "Review",
            html: `
              <div class="text-left">
                <p><strong>Product:</strong> ${review.product_title}</p>
                <p><strong>User:</strong> ${userName}</p>
                <p><strong>Rating:</strong> ${stars}</p>
                <p><strong>Date:</strong> ${new Date(review.created_at).toLocaleDateString()}</p>
                <hr class="my-3">
                <p><strong>Review:</strong></p>
                <p class="text-gray-700">${review.review_text || "No review text provided."}</p>
              </div>
            `,
            width: "600px",
            confirmButtonText: "Close",
          })
        }
      },
      error: (xhr) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load review details",
        })
      },
    })
  })

  // Delete review
  $(document).on("click", ".delete-review", function () {
    const reviewId = $(this).data("id")

    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the review",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        window.makeAuthenticatedRequest({
          url: `${API_BASE_URL}/reviews/${reviewId}`,
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
              reviewsTable.ajax.reload()
            }
          },
          error: (xhr) => {
            const response = xhr.responseJSON
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.message || "Failed to delete review",
            })
          },
        })
      }
    })
  })

  // Initialize only if authenticated
  if (window.checkAuth && window.checkAuth()) {
    initializeReviewsTable()
  } else {
    // Handle unauthenticated state
    console.warn("User not authenticated - reviews table not initialized")
  }
})