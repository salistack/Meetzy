const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || dft3fzpuj,
  api_key: process.env.CLOUDINARY_API_KEY || 356362532638883,
  api_secret: process.env.CLOUDINARY_API_SECRET || MUr8DcBXenBX4mEiHiNQ8-va98g,
});


module.exports = cloudinary;
