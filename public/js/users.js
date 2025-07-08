const $ = require("jquery")
const API_BASE_URL = "https://localhost:4000/api"
const getAuthHeaders = () => ({ Authorization: "Bearer " + localStorage.getItem("token") })
const makeAuthenticatedRequest = (options) => $.ajax({ ...options, headers: getAuthHeaders() })
const Swal = require("sweetalert2")
const checkAuth = () => !!localStorage.getItem("token")

$(document).ready(() => {
  let usersTable

  // Initialize DataTable
  function initializeUsersTable() {
    usersTable = $("#usersTable").DataTable({
      ajax: {
        url: `${API_BASE_URL}/users`,
        headers: getAuthHeaders(),
        dataSrc: "users",
      },
      columns: [
        { data: "user_id" },
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

            return editBtn + toggleBtn
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

  // Edit user
  $(document).on("click", ".edit-user", function () {
    const userId = $(this).data("id")

    makeAuthenticatedRequest({
      url: `${API_BASE_URL}/users/profile/${userId}`,
      method: "GET",
      success: (response) => {
        if (response.success) {
          const user = response.user
          $("#userId").val(user.user_id)
          $("#firstName").val(user.first_name || "")
          $("#lastName").val(user.last_name || "")
          $("#contactNumber").val(user.contact_number || "")
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

    makeAuthenticatedRequest({
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
          title: "Update Failed",
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
        makeAuthenticatedRequest({
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
        makeAuthenticatedRequest({
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
  if (checkAuth()) {
    initializeUsersTable()
  }
})
