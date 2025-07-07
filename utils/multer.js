const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname).toLowerCase()
    const baseName = path.parse(file.originalname).name.replace(/\\/g, "/")
    cb(null, baseName + "-" + uniqueSuffix + ext)
  },
})

module.exports = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif" && ext !== ".webp") {
      cb(new Error("Unsupported file type! Only JPG, JPEG, PNG, GIF, and WebP are allowed."), false)
      return
    }
    cb(null, true)
  },
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 10, 
  },
})
