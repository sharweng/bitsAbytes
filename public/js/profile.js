$(document).ready(() => {
  const API_BASE_URL = "http://localhost:4000/api"
  const $ = window.$
  const Swal = window.Swal

  let currentUser = null

  // Initialize the page
  initializePage()

  function initializePage() {
    checkAuthAndLoadProfile()
    initializeEventListeners()
  }

  function checkAuthAndLoadProfile() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!token || !user.user_id) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Please log in to view your profile.",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.href = "index.html"
      })
      return
    }
    currentUser = user
    loadUserProfile(user.user_id, token)
  }

  function initializeEventListeners() {
    // Tab switching
    $("#infoTabBtn").click(() => switchTab("information"))
    $("#securityTabBtn").click(() => switchTab("security"))

    // Form submissions
    $("#infoForm").submit(handleInformationSubmit)
    $("#securityForm").submit(handleSecuritySubmit)

    // Image preview
    $("#image").change(function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          $("#profileImagePreview").attr("src", e.target.result)
        }
        reader.readAsDataURL(this.files[0])
      } else {
        $("#profileImagePreview").attr("src", "/placeholder.svg?height=120&width=120")
      }
    })
  }

  function switchTab(tabName) {
    $(".tab-button").removeClass("active")
    $(".tab-content").addClass("hidden")

    if (tabName === "information") {
      $("#infoTabBtn").addClass("active")
      $("#informationTabContent").removeClass("hidden")
    } else if (tabName === "security") {
      $("#securityTabBtn").addClass("active")
      $("#securityTabContent").removeClass("hidden")
    }
  }

  function loadUserProfile(userId, token) {
    $.ajax({
      url: `${API_BASE_URL}/users/profile/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: (response) => {
        if (response.success && response.user) {
          const user = response.user
          // Populate Information tab
          $("#firstName").val(user.first_name || "")
          $("#lastName").val(user.last_name || "")
          $("#contactNumber").val(user.contact_number || "")
          if (user.image_url) {
            $("#profileImagePreview").attr("src", `${API_BASE_URL.replace("/api", "")}${user.image_url}`)
          } else {
            $("#profileImagePreview").attr("src", "/placeholder.svg?height=120&width=120")
          }

          // Populate Security tab
          $("#email").val(user.email || "")
        } else {
          showError("Failed to load profile data.")
        }
      },
      error: (xhr) => {
        console.error("Error loading user profile:", xhr)
        showError(xhr.responseJSON?.message || "Error loading profile data.")
      },
    })
  }

  // New function to verify password using the login API
  async function verifyCurrentPassword(email, password) {
    try {
      const response = await $.ajax({
        url: `${API_BASE_URL}/users/login`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email, password }),
      })
      return response.success // login endpoint returns success: true on valid credentials
    } catch (xhr) {
      console.error("Password verification failed:", xhr)
      showError(xhr.responseJSON?.message || "Incorrect password. Please try again.")
      return false
    }
  }

  async function handleInformationSubmit(e) {
    e.preventDefault()

    const currentPassword = await promptForPassword()
    if (!currentPassword) {
      return // User cancelled or didn't enter password
    }

    // Verify password using the login API
    const isPasswordCorrect = await verifyCurrentPassword(currentUser.email, currentPassword)
    if (!isPasswordCorrect) {
      return // Error message already shown by verifyCurrentPassword
    }

    // If password is correct, proceed with update
    const formData = new FormData()
    formData.append("first_name", $("#firstName").val())
    formData.append("last_name", $("#lastName").val())
    formData.append("contact_number", $("#contactNumber").val())

    const imageFile = $("#image")[0].files[0]
    if (imageFile) {
      formData.append("image", imageFile)
    }

    $.ajax({
      url: `${API_BASE_URL}/users/profile/${currentUser.user_id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: formData,
      processData: false, // Important for FormData
      contentType: false, // Important for FormData
      success: (response) => {
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Profile Updated!",
            text: response.message,
            timer: 1500,
            showConfirmButton: false,
          })
          // Update local storage user info if relevant fields changed
          const updatedUser = JSON.parse(localStorage.getItem("user"))
          updatedUser.first_name = $("#firstName").val()
          updatedUser.last_name = $("#lastName").val()
          updatedUser.contact_number = $("#contactNumber").val()
          if (response.image_url) {
            updatedUser.image_url = response.image_url
          }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          // Re-load profile to ensure latest data is displayed (especially for image)
          loadUserProfile(currentUser.user_id, localStorage.getItem("token"))
        } else {
          showError(response.message || "Failed to update profile.")
        }
      },
      error: (xhr) => {
        console.error("Error updating profile:", xhr)
        showError(xhr.responseJSON?.message || "Error updating profile.")
      },
    })
  }

  async function handleSecuritySubmit(e) {
    e.preventDefault()

    const newPassword = $("#newPassword").val()
    const confirmPassword = $("#confirmPassword").val()

    if (newPassword && newPassword !== confirmPassword) {
      showError("New password and confirm password do not match.")
      return
    }

    if (newPassword && newPassword.length < 6) {
      showError("New password must be at least 6 characters long.")
      return
    }

    const currentPassword = await promptForPassword()
    if (!currentPassword) {
      return // User cancelled or didn't enter password
    }

    // Verify password using the login API
    const isPasswordCorrect = await verifyCurrentPassword(currentUser.email, currentPassword)
    if (!isPasswordCorrect) {
      return // Error message already shown by verifyCurrentPassword
    }

    // If password is correct, proceed with password update (if new password provided)
    if (newPassword) {
      $.ajax({
        url: `${API_BASE_URL}/users/change-password/${currentUser.user_id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json", // Specify content type for JSON body
        },
        data: JSON.stringify({ newPassword: newPassword }), // Send new password in JSON body
        success: (response) => {
          if (response.success) {
            Swal.fire({
              icon: "success",
              title: "Password Updated!",
              text: response.message,
              timer: 1500,
              showConfirmButton: false,
            })
            $("#newPassword").val("")
            $("#confirmPassword").val("")
          } else {
            showError(response.message || "Failed to update password.")
          }
        },
        error: (xhr) => {
          console.error("Error updating password:", xhr)
          showError(xhr.responseJSON?.message || "Error updating password.")
        },
      })
    } else {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "No new password was provided. No changes were made.",
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  async function promptForPassword() {
    const { value: password } = await Swal.fire({
      title: "Enter Current Password",
      input: "password",
      inputLabel: "For security, please enter your current password to confirm changes.",
      inputPlaceholder: "Enter your password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter your password!"
        }
      },
    })
    return password
  }

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
    })
  }
})
