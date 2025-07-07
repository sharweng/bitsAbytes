const connection = require("../config/database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
  // {
  //   "email": "steve@gmail.com",
  //   "password": "password"
  // }
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const userSql = "INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, ?)"

    connection.execute(userSql, [email, hashedPassword, 1], (err, result) => {
      if (err) {
        console.log(err)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          })
        }
        return res.status(500).json({
          success: false,
          message: "Error creating user",
          error: err.message,
        })
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user_id: result.insertId,
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const loginUser = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    })
  }

  const sql = `
    SELECT u.user_id, u.email, u.password_hash, u.first_name, u.last_name, 
           u.contact_number, u.image_url, r.description as role
    FROM users u 
    JOIN roles r ON u.role_id = r.role_id 
    WHERE u.email = ? AND u.deleted = 0
  `

  connection.execute(sql, [email], async (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error logging in",
        error: err.message,
      })
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const user = results[0]

    try {
      const match = await bcrypt.compare(password, user.password_hash)

      if (!match) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Remove password from response
      delete user.password_hash

      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      )

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: user,
        token: token,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: "Error during authentication",
        error: error.message,
      })
    }
  })
}

const updateUser = (req, res) => {
  const { first_name, last_name, contact_number } = req.body
  const { user_id } = req.params
  let image_url = null

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    })
  }

  if (req.file) {
    image_url = req.file.path.replace(/\\/g, "/")
  }

  const userSql = `
    UPDATE users 
    SET first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        contact_number = COALESCE(?, contact_number),
        image_url = COALESCE(?, image_url),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `

  const params = [first_name, last_name, contact_number, image_url, user_id]

  try {
    connection.execute(userSql, params, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error updating user",
          error: err.message,
        })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        affected_rows: result.affectedRows,
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const deactivateUser = (req, res) => {
  const { user_id } = req.params

  const sql = "UPDATE users SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND deleted = 0"
  const params = [user_id]

  connection.execute(sql, params, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error deactivating user",
        error: err.message,
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or already deactivated",
      })
    }

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      user_id: user_id,
      deactivated_at: new Date(),
    })
  })
}

const getUserProfile = (req, res) => {
  const { user_id } = req.params

  const sql = `
    SELECT u.user_id, u.email, u.first_name, u.last_name, 
           u.contact_number, u.image_url, u.created_at, r.description as role
    FROM users u 
    JOIN roles r ON u.role_id = r.role_id 
    WHERE u.user_id = ? AND u.deleted = 0
  `

  connection.execute(sql, [user_id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error fetching user profile",
        error: err.message,
      })
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    return res.status(200).json({
      success: true,
      user: results[0],
    })
  })
}

const reactivateUser = (req, res) => {
  const { user_id } = req.params

  const sql = "UPDATE users SET deleted = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND deleted = 1"
  const params = [user_id]

  connection.execute(sql, params, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error reactivating user",
        error: err.message,
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or already active",
      })
    }

    return res.status(200).json({
      success: true,
      message: "User reactivated successfully",
      user_id: user_id,
      reactivated_at: new Date(),
    })
  })
}

const getAllUsers = (req, res) => {
  const { include_deleted = "false", role_filter } = req.query

  let whereClause = ""
  const params = []

  // Handle deleted users filter
  if (include_deleted === "true") {
    // Show all users (both active and deactivated)
    whereClause = ""
  } else if (include_deleted === "only") {
    // Show only deactivated users
    whereClause = "WHERE u.deleted = 1"
  } else {
    // Default: show only active users
    whereClause = "WHERE u.deleted = 0"
  }

  // Handle role filter
  if (role_filter) {
    if (whereClause === "") {
      whereClause = "WHERE r.description = ?"
    } else {
      whereClause += " AND r.description = ?"
    }
    params.push(role_filter)
  }

  const sql = `
    SELECT u.user_id, u.email, u.first_name, u.last_name, 
           u.contact_number, u.image_url, u.deleted, u.created_at, 
           u.updated_at, r.description as role
    FROM users u 
    JOIN roles r ON u.role_id = r.role_id 
    ${whereClause}
    ORDER BY u.created_at DESC
  `

  try {
    connection.execute(sql, params, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error fetching users",
          error: err.message,
        })
      }

      // Convert deleted field to proper boolean and count users
      const processedResults = results.map((user) => ({
        ...user,
        deleted: Boolean(user.deleted), // Convert to proper boolean
      }))

      // Count active and deactivated users using both number and boolean comparison
      const activeUsers = results.filter((user) => user.deleted == 0 || user.deleted === false).length
      const deactivatedUsers = results.filter((user) => user.deleted == 1 || user.deleted === true).length

      console.log(
        "Debug - Sample user deleted values:",
        results.slice(0, 3).map((u) => ({ id: u.user_id, deleted: u.deleted, type: typeof u.deleted })),
      )
      console.log("Debug - Active users count:", activeUsers)
      console.log("Debug - Deactivated users count:", deactivatedUsers)

      return res.status(200).json({
        success: true,
        users: processedResults,
        total_users: results.length,
        active_users: activeUsers,
        deactivated_users: deactivatedUsers,
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  getUserProfile,
  getAllUsers,
}
