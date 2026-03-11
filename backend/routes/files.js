const express = require('express');
const { uploadToS3, s3Client } = require('../lib/s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const prisma = require('../lib/prisma');
const verifyToken = require('../middleware/auth');

const router = express.Router();

const toJSON = (f) => ({ ...f, size: f.size.toString() });

// GET /api/files — non-trashed, non-spam files for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { ownerId: req.user.userId, isTrashed: false, isSpam: false },
      orderBy: { createdAt: 'desc' },
    });
    res.json(files.map(toJSON));
  } catch (error) {
    console.error('Fetch files error:', error);
    res.status(500).json({ message: 'Server error fetching files' });
  }
});

// GET /api/files/starred
router.get('/starred', verifyToken, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { ownerId: req.user.userId, isStarred: true, isTrashed: false },
      orderBy: { createdAt: 'desc' },
    });
    res.json(files.map(toJSON));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/files/trashed
router.get('/trashed', verifyToken, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { ownerId: req.user.userId, isTrashed: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(files.map(toJSON));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/files/spam
router.get('/spam', verifyToken, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { ownerId: req.user.userId, isSpam: true, isTrashed: false },
      orderBy: { createdAt: 'desc' },
    });
    res.json(files.map(toJSON));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/files/:id — update isStarred / isTrashed / isSpam flags
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { isStarred, isTrashed, isSpam } = req.body;
    const data = {};
    if (isStarred !== undefined) data.isStarred = isStarred;
    if (isTrashed !== undefined) data.isTrashed = isTrashed;
    if (isSpam   !== undefined) data.isSpam   = isSpam;
    const file = await prisma.file.update({
      where: { id: req.params.id },
      data,
    });
    res.json(toJSON(file));
  } catch (error) {
    console.error('Patch file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/files/:id — delete from S3 and DB
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const file = await prisma.file.findFirst({
      where: { id: req.params.id, ownerId: req.user.userId },
    });
    if (!file) return res.status(404).json({ message: 'File not found' });
    // Remove from S3
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.s3Key,
    }));
    // Remove from DB and decrease storage
    await prisma.file.delete({ where: { id: req.params.id } });
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { storageUsed: { decrement: file.size } },
    });
    res.json({ message: 'Deleted permanently' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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