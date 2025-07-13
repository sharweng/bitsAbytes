$(document).ready(() => {
  const API_BASE_URL = window.API_BASE_URL || "http://localhost:4000/api"
  let usersTable
  const $ = window.$ // Declare the $ variable
  const Swal = window.Swal // Declare the Swal variable

  // Initialize DataTable
  function initializeUsersTable() {
    usersTable = $("#usersTable").DataTable({
      ajax: {
        url: `${API_BASE_URL}/users`,
        headers: window.getAuthHeaders(),
        dataSrc: "users",
        error: (xhr, error, code) => {
          console.error("DataTable AJAX error:", xhr, error, code)
        },
      },
      columns: [
        { data: "user_id" },
        {
          data: "image_url",
          render: (data) => {
            if (data) {
              return `<img src="${data}" alt="User" class="w-12 h-12 object-cover rounded-full">`
            }
            return '<div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"><i class="fas fa-user text-gray-400"></i></div>'
          },
        },
        { data: "email" },
        {
          data: null,
          render: (data) => {
            const firstName = data.first_name || ""
            const lastName = data.last_name || ""
            return `${firstName} ${lastName}`.trim() || "N/A"
          },
        },
        {
          data: "contact_number",
          render: (data) => data || "N/A",
        },
        { data: "role" },
        {
          data: "deleted",
          render: (data) =>
            data
              ? '<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Deactivated</span>'
              : '<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>',
        },
        {
          data: "created_at",
          render: (data) => new Date(data).toLocaleDateString(),
        },
        {
          data: null,
          render: (data) => {
            const viewBtn = `<button class="text-green-600 hover:text-green-800 mr-2 view-user" data-id="${data.user_id}" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>`

            const editBtn = `<button class="text-blue-600 hover:text-blue-800 mr-2 edit-user" data-id="${data.user_id}">
                        <i class="fas fa-edit"></i>
                      </button>`

            const toggleBtn = data.deleted
              ? `<button class="text-green-600 hover:text-green-800 reactivate-user" data-id="${data.user_id}">
                          <i class="fas fa-user-check"></i>
                      </button>`
              : `<button class="text-red-600 hover:text-red-800 deactivate-user" data-id="${data.user_id}">
                          <i class="fas fa-user-slash"></i>
                      </button>`

            return viewBtn + editBtn + toggleBtn
          },
        },
      ],
      responsive: true,
      pageLength: 25,
    })
  }

  // Filter users
  $("#userFilter").on("change", function () {
    const filterValue = $(this).val()
    let url = `${API_BASE_URL}/users`

    if (filterValue === "true") {
      url += "?include_deleted=only"
    } else if (filterValue === "false") {
      url += "?include_deleted=false"
    } else {
      url += "?include_deleted=true"
    }

    usersTable.ajax.url(url).load()
  })

  // Add this function to fetch roles
  function loadRolesForDropdown() {
    $.ajax({
      url: `${API_BASE_URL}/users/roles`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const select = $("#userRole")
          select.find("option").remove()

          response.roles.forEach((role) => {
            select.append(`<option value="${role.role_id}">${role.description}</option>`)
          })
        }
      },
      error: (xhr) => {
        console.error("Error loading roles:", xhr)
      },
    })
  }

  // View user details
  $(document).on("click", ".view-user", function () {
    const userId = $(this).data("id")

    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/users/profile/${userId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const user = response.user

          // Create user image
          let imageHtml = ""
          if (user.image_url) {
            imageHtml = `
          <div class="mb-4 text-center">
            <img src="${user.image_url}" alt="Profile" class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-200">
          </div>
        `
          } else {
            imageHtml = `
          <div class="mb-4 text-center">
            <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center border-4 border-gray-200">
              <i class="fas fa-user text-4xl text-gray-400"></i>
            </div>
          </div>
        `
          }

          const content = `
        <div class="space-y-4">
          ${imageHtml}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>User ID:</strong> ${user.user_id}</div>
            <div><strong>Email:</strong> ${user.email}</div>
            <div><strong>First Name:</strong> ${user.first_name || "N/A"}</div>
            <div><strong>Last Name:</strong> ${user.last_name || "N/A"}</div>
            <div><strong>Contact Number:</strong> ${user.contact_number || "N/A"}</div>
            <div><strong>Role:</strong> ${user.role}</div>
            <div><strong>Account Created:</strong> ${new Date(user.created_at).toLocaleDateString()}</div>
            <div><strong>Status:</strong> 
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div class="md:col-span-2"><strong>Shipping Address:</strong> ${user.shipping_address || "N/A"}</div>
          </div>
        </div>
      `

          Swal.fire({
            title: "User Details",
            html: content,
            width: "600px",
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
              popup: "text-left",
            },
          })
        }
      },
      error: (xhr) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load user details",
        })
      },
    })
  })

  // Edit user
  $(document).on("click", ".edit-user", function () {
    const userId = $(this).data("id")

    // First load roles
    loadRolesForDropdown()

    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/users/profile/${userId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const user = response.user
          $("#userId").val(user.user_id)
          $("#firstName").val(user.first_name || "")
          $("#lastName").val(user.last_name || "")
          $("#contactNumber").val(user.contact_number || "")
          $("#shippingAddress").val(user.shipping_address || "")

          // Set the role after a short delay to ensure options are loaded
          setTimeout(() => {
            // Find the role_id based on role description
            const roleSelect = $("#userRole")
            const roleOptions = roleSelect.find("option")

            roleOptions.each(function () {
              if ($(this).text().toLowerCase() === user.role.toLowerCase()) {
                $(this).prop("selected", true)
              }
            })
          }, 100)

          $("#userModal").removeClass("hidden").addClass("flex")
        }
      },
      error: (xhr) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load user data",
        })
      },
    })
  })

  // Update user
  $("#userForm").on("submit", function (e) {
    e.preventDefault()

    const userId = $("#userId").val()
    const formData = new FormData(this)

    window.makeAuthenticatedRequest({
      url: `${API_BASE_URL}/users/profile/${userId}`,
      method: "PUT",
      data: formData,
      processData: false,
      contentType: false,
      success: (response) => {
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.message,
            timer: 1500,
            showConfirmButton: false,
          })
          $("#userModal").addClass("hidden").removeClass("flex")
          usersTable.ajax.reload()
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "An error occurred",
        })
      },
    })
  })

  // Deactivate user
  $(document).on("click", ".deactivate-user", function () {
    const userId = $(this).data("id")

    Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate the user account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate",
    }).then((result) => {
      if (result.isConfirmed) {
        window.makeAuthenticatedRequest({
          url: `${API_BASE_URL}/users/deactivate/${userId}`,
          method: "PUT",
          success: (response) => {
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "Deactivated!",
                text: response.message,
                timer: 1500,
                showConfirmButton: false,
              })
              usersTable.ajax.reload()
            }
          },
          error: (xhr) => {
            const response = xhr.responseJSON
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.message || "Failed to deactivate user",
            })
          },
        })
      }
    })
  })

  // Reactivate user
  $(document).on("click", ".reactivate-user", function () {
    const userId = $(this).data("id")

    Swal.fire({
      title: "Reactivate User?",
      text: "This will reactivate the user account",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, reactivate",
    }).then((result) => {
      if (result.isConfirmed) {
        window.makeAuthenticatedRequest({
          url: `${API_BASE_URL}/users/reactivate/${userId}`,
          method: "PUT",
          success: (response) => {
            if (response.success) {
              Swal.fire({
                icon: "success",
                title: "Reactivated!",
                text: response.message,
                timer: 1500,
                showConfirmButton: false,
              })
              usersTable.ajax.reload()
            }
          },
          error: (xhr) => {
            const response = xhr.responseJSON
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.message || "Failed to reactivate user",
            })
          },
        })
      }
    })
  })

  // Modal controls
  $("#closeModal, #cancelBtn").on("click", () => {
    $("#userModal").addClass("hidden").removeClass("flex")
  })

  // Initialize
  if (window.checkAuth && window.checkAuth()) {
    initializeUsersTable()
  }
})
