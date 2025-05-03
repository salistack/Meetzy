// middleware/upload.js
const multer = require("multer");
const storage = require("./cloudinaryStorage"); // Import the Cloudinary storage
const upload = multer({ storage: storage }); // Initialize multer with the storage

module.exports = upload;
