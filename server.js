const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
require('dotenv').config()
const app = express()

// Serve static files (like index.html)
app.use(express.static(__dirname))

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error('Only JPG/PNG allowed'), false)
        }
    }
})

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4'
})

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

        // Image resizing (Optimize for Web)
        const optimizedBuffer = await sharp(req.file.buffer)
            .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer()

        const fileName = `optimized-${Date.now()}-${uuidv4()}.jpg`

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            Body: optimizedBuffer,
            ContentType: 'image/jpeg'
        }

        // Upload optimized file
        await s3.upload(params).promise()

        // Generate a 1-hour secure Signed URL
        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            Expires: 60 * 60 
        })

        console.log(`🔥 Request handled by port ${process.env.PORT || 3001}`)
        res.json({ url: signedUrl })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
