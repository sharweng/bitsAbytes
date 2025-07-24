$(document).ready(() => {
  const API_BASE_URL = "http://localhost:4000/api"
  const Swal = window.Swal
  const $ = window.$ // Declare the $ variable before using it

  let currentUser = null
  let currentImageUrl = null

  // Initialize the page
  initializePage()

  function initializePage() {
    checkAuthAndLoadProfile()
    initializeEventListeners()
    initializeFormValidations() // New function for validations
  }

  function checkAuthAndLoadProfile() {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    console.log("Profile page - Auth check:", {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 50) + "..." : null,
      hasUser: !!user.user_id,
      userId: user.user_id,
      userEmail: user.email,
    })

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
    currentImageUrl = user.image_url || "/images/default-user.jpg"
    loadUserProfile(user.user_id, token)
  }

  function initializeEventListeners() {
    // Tab switching
    $("#infoTabBtn").click(() => switchTab("information"))
    $("#securityTabBtn").click(() => switchTab("security"))

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

    // Handle profile image change
    $("#profile_image").on("change", function () {
      const file = this.files[0]
      if (file) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
          Swal.fire({
            icon: "error",
            title: "Invalid File Type",
            text: "Please select a valid image file (JPEG, JPG, PNG, or GIF)",
          })
          this.value = ""
          return
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
          Swal.fire({
            icon: "error",
            title: "File Too Large",
            text: "Please select an image smaller than 5MB",
          })
          this.value = ""
          return
        }

        // Preview the image
        const reader = new FileReader()
        reader.onload = (e) => {
          $("#profile-image-preview").attr("src", e.target.result)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  function initializeFormValidations() {
    // Information Form Validation
    $("#infoForm").validate({
      rules: {
        first_name: {
          minlength: 2,
        },
        last_name: {
          minlength: 2,
        },
        contact_number: {
          digits: true, // Only digits allowed
          minlength: 11,
          maxlength: 12,
        },
        shipping_address: {
          minlength: 5,
        },
        image: {
          extension: "jpg|jpeg|png", // Allow only these image types
        },
      },
      messages: {
        first_name: {
          minlength: "First name must be at least 2 characters.",
        },
        last_name: {
          minlength: "Last name must be at least 2 characters.",
        },
        contact_number: {
          digits: "Please enter a valid contact number (digits only).",
          minlength: "Contact number must be at least 11 digits.",
          maxlength: "Contact number cannot exceed 12 digits.",
        },
        shipping_address: {
          minlength: "Shipping address must be at least 5 characters.",
        },
        image: {
          extension: "Please upload a valid image file (JPG, JPEG, PNG).",
        },
      },
      submitHandler: (form) => {
        // Call the original handler, which now doesn't need e.preventDefault()
        handleInformationSubmit()
      },
    })

    // Security Form Validation
    $("#securityForm").validate({
      rules: {
        new_password: {
          // Corresponds to name="new_password"
          minlength: 6,
        },
        confirm_password: {
          // Corresponds to name="confirm_password"
          equalTo: "#newPassword", // Matches the ID of the new password field
        },
      },
      messages: {
        new_password: {
          minlength: "New password must be at least 6 characters long.",
        },
        confirm_password: {
          equalTo: "Please enter the same password as above.",
        },
      },
      submitHandler: (form) => {
        // Call the original handler, which now doesn't need e.preventDefault()
        handleSecuritySubmit()
      },
    })
  }

  function switchTab(tabName) {
    $(".tab-button").removeClass("active")
    $(".tab-content").addClass("hidden")

    if (tabName === "information") {
      $("#infoTabBtn").addClass("active")
      $("#informationTabContent").removeClass("hidden")
      $("#infoForm").validate().resetForm() // Clear validation errors when switching tabs
    } else if (tabName === "security") {
      $("#securityTabBtn").addClass("active")
      $("#securityTabContent").removeClass("hidden")
      $("#securityForm").validate().resetForm() // Clear validation errors when switching tabs
    }
  }

  function loadUserProfile(userId, token) {
    console.log("Loading profile for user:", userId, "with token:", token.substring(0, 50) + "...")

    $.ajax({
      url: `${API_BASE_URL}/users/profile/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: (response) => {
        console.log("Profile loaded successfully:", response)
        if (response.success && response.user) {
          const user = response.user
          // Populate Information tab
          $("#firstName").val(user.first_name || "")
          $("#lastName").val(user.last_name || "")
          $("#contactNumber").val(user.contact_number || "")
          $("#shippingAddress").val(user.shipping_address || "") // Load shipping address
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
        console.error("Response:", xhr.responseJSON)

        if (xhr.status === 403 || xhr.status === 401) {
          console.log("Token validation failed, clearing auth data")
          localStorage.removeItem("token")
          localStorage.removeItem("user")

          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.href = "index.html"
          })
          return
        }

        showError(xhr.responseJSON?.message || "Error loading profile data.")
      },
    })
  }

  // NEW: Dedicated password verification function
  async function verifyCurrentPassword(password) {
    try {
      console.log("=== Password Verification ===")
      console.log("Verifying password using dedicated endpoint for user:", currentUser.user_id)

      const currentToken = localStorage.getItem("token")
      const response = await $.ajax({
        url: `${API_BASE_URL}/users/verify-password/${currentUser.user_id}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ password }),
      })

      console.log("Password verification response:", response)
      return response.success
    } catch (xhr) {
      console.error("Password verification failed:", xhr)
      console.error("Status:", xhr.status)
      console.error("Response:", xhr.responseJSON)

      if (xhr.status === 401) {
        console.log("Password verification failed - incorrect password")
        return false // Wrong password
      }

      if (xhr.status === 403) {
        const response = xhr.responseJSON
        if (
          response &&
          (response.message.includes("expired") ||
            response.message.includes("Invalid or expired session") ||
            response.message.includes("Token has expired"))
        ) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")

          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.href = "index.html"
          })
          return false
        }
      }

      showError(xhr.responseJSON?.message || "Error verifying password.")
      return false
    }
  }

  async function handleInformationSubmit() {
    console.log("=== Starting Information Form Submit ===")

    try {
      const currentPassword = await promptForPassword()
      if (!currentPassword) {
        console.log("User cancelled password prompt")
        return // User cancelled or didn't enter password
      }

      console.log("Password entered, verifying...")

      // Verify password using the dedicated endpoint
      const isPasswordCorrect = await verifyCurrentPassword(currentPassword)
      console.log("Password verification result:", isPasswordCorrect)

      if (!isPasswordCorrect) {
        console.log("Password verification failed")
        showError("Incorrect password. Please try again.")
        return
      }

      console.log("Password verified successfully, proceeding with profile update")

      // Get the current token from localStorage
      const currentToken = localStorage.getItem("token")
      console.log("Current token for update:", {
        hasToken: !!currentToken,
        tokenLength: currentToken ? currentToken.length : 0,
        tokenPreview: currentToken ? currentToken.substring(0, 50) + "..." : null,
        userId: currentUser.user_id,
      })

      // If password is correct, proceed with update
      const formData = new FormData()
      formData.append("first_name", $("#firstName").val())
      formData.append("last_name", $("#lastName").val())
      formData.append("contact_number", $("#contactNumber").val())
      formData.append("shipping_address", $("#shippingAddress").val()) // Add shipping address

      const imageFile = $("#image")[0].files[0]
      if (imageFile) {
        formData.append("image", imageFile)
        console.log("Image file added to form data:", imageFile.name)
      }

      console.log("Making profile update request to:", `${API_BASE_URL}/users/profile/${currentUser.user_id}`)
      console.log("Form data contents:")
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      const updateResponse = await $.ajax({
        url: `${API_BASE_URL}/users/profile/${currentUser.user_id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        data: formData,
        processData: false, // Important for FormData
        contentType: false, // Important for FormData
      })

      console.log("Profile update successful:", updateResponse)

      if (updateResponse.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: updateResponse.message,
          timer: 1500,
          showConfirmButton: false,
        })

        // Update local storage user info if relevant fields changed
        const updatedUser = JSON.parse(localStorage.getItem("user"))
        updatedUser.first_name = $("#firstName").val()
        updatedUser.last_name = $("#lastName").val()
        updatedUser.contact_number = $("#contactNumber").val()
        updatedUser.shipping_address = $("#shippingAddress").val() // Update shipping address in local storage
        if (updateResponse.image_url) {
          updatedUser.image_url = updateResponse.image_url
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Re-load profile to ensure latest data is displayed (especially for image)
        loadUserProfile(currentUser.user_id, currentToken)
      } else {
        showError(updateResponse.message || "Failed to update profile.")
      }
    } catch (xhr) {
      console.error("=== Profile Update Error ===")
      console.error("Status:", xhr.status)
      console.error("Status Text:", xhr.statusText)
      console.error("Response:", xhr.responseJSON)
      console.error("Response Text:", xhr.responseText)
      console.error("Request URL:", `${API_BASE_URL}/users/profile/${currentUser.user_id}`)

      if (xhr.status === 403) {
        console.error("403 Forbidden - Token validation failed")
        const response = xhr.responseJSON

        if (
          response &&
          (response.message.includes("expired") ||
            response.message.includes("Invalid or expired session") ||
            response.message.includes("Token has expired"))
        ) {
          console.log("Token expired, clearing auth data")
          localStorage.removeItem("token")
          localStorage.removeItem("user")

          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.href = "index.html"
          })
          return
        }
      }

      showError(xhr.responseJSON?.message || "Error updating profile.")
    }
  }

  async function handleSecuritySubmit() {
    console.log("=== Starting Security Form Submit ===")

    const newPassword = $("#newPassword").val()
    const confirmPassword = $("#confirmPassword").val()

    // Validation is now handled by jQuery Validate, but we keep this for the promptForPassword logic
    if (newPassword && newPassword !== confirmPassword) {
      showError("New password and confirm password do not match.")
      return
    }

    if (newPassword && newPassword.length < 6) {
      showError("New password must be at least 6 characters long.")
      return
    }

    try {
      const currentPassword = await promptForPassword()
      if (!currentPassword) {
        return // User cancelled or didn't enter password
      }

      // Verify password using the dedicated endpoint
      const isPasswordCorrect = await verifyCurrentPassword(currentPassword)
      if (!isPasswordCorrect) {
        showError("Incorrect password. Please try again.")
        return
      }

      // If password is correct, proceed with password update (if new password provided)
      if (newPassword) {
        const currentToken = localStorage.getItem("token")

        const response = await $.ajax({
          url: `${API_BASE_URL}/users/change-password/${currentUser.user_id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json", // Specify content type for JSON body
          },
          data: JSON.stringify({ newPassword: newPassword }), // Send new password in JSON body
        })

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
      } else {
        Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "No new password was provided. No changes were made.",
          timer: 1500,
          showConfirmButton: false,
        })
      }
    } catch (xhr) {
      console.error("Error updating password:", xhr)

      if (xhr.status === 403 || xhr.status === 401) {
        const response = xhr.responseJSON
        if (
          response &&
          (response.message.includes("expired") ||
            response.message.includes("Invalid or expired session") ||
            response.message.includes("Token has expired"))
        ) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")

          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.href = "index.html"
          })
          return
        }
      }

      showError(xhr.responseJSON?.message || "Error updating password.")
    }
  }

  async function promptForPassword() {
    const { value: password } = await Swal.fire({
      title: "Enter Current Password",
      input: "password",
      text: "For security, please enter your current password to confirm changes.",
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

  function makeAuthenticatedRequest(options) {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No token found for request")
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Please log in again to perform this action",
      })
      return
    }

    $.ajax({
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  function getAuthToken() {
    return localStorage.getItem("token")
  }

  function clearAuth() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }
})
