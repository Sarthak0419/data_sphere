const express = require('express');
const { uploadToS3 } = require('../lib/s3');
const prisma = require('../lib/prisma');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// POST /api/files/upload
// 1. verifyToken: Checks if the user is logged in
// 2. uploadToS3.single('file'): Streams the file to AWS S3
router.post('/upload', verifyToken, uploadToS3.single('file'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('req.file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // req.file is populated by multer-s3 after a successful AWS upload
    const { originalname, size, mimetype, key, location } = req.file;
    const ownerId = req.user.userId; // Extracted from the JWT token

    // Save the file metadata to PostgreSQL
    const newFile = await prisma.file.create({
      data: {
        name: originalname,
        size: BigInt(size),
        type: mimetype,
        s3Key: key,       // e.g., "uploads/16789-document.pdf"
        s3Url: location,  // The direct S3 URL (though it's private, good to store)
        ownerId: ownerId,
      }
    });

    // Update the user's total storage used
    await prisma.user.update({
      where: { id: ownerId },
      data: {
        storageUsed: { increment: BigInt(size) }
      }
    });

    res.status(201).json({
      message: 'File uploaded to AWS S3 successfully!',
      file: {
        ...newFile,
        size: newFile.size.toString() // Convert BigInt for JSON response
      }
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

module.exports = router;