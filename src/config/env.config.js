const PORT = process.env.PORT || "5000";
const ORIGIN = process.env.ORIGIN || `["http://localhost:3000"]`;
const JWT_SECRET = process.env.JWT_SECRET || "itssecret";
const NODE_ENV = process.env.NODE_ENV || "dev";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "itssecret";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "itssecret";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "itssecret";
const CLOUDINARY_SECURE = process.env.CLOUDINARY_SECURE || "itssecret";

/* Cloudinary configurations */
const cloudinaryConfig = {
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: CLOUDINARY_SECURE,
}

module.exports = {
  PORT,
  ORIGIN,
  JWT_SECRET,
  NODE_ENV,
  CLOUDINARY_CONFIG: cloudinaryConfig
};
