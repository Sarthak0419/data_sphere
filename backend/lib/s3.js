// backend/lib/s3.js
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// 1. Initialize the S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// 2. Configure Multer to upload to S3
const uploadToS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // Ensure files are kept private
    acl: 'private', 
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Create a unique S3 key (filename) to prevent overwriting
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // Optional: Organise into folders by user ID if you have it in req.user
      cb(null, `uploads/${uniqueSuffix}-${file.originalname}`);
    }
  }),
  // Optional: Limit file size (e.g., 50MB)
  limits: { fileSize: 50 * 1024 * 1024 } 
});

module.exports = { s3Client, uploadToS3 };