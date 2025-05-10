const express = require('express');
     const multer = require('multer');
     const cors = require('cors');
     const fs = require('fs').promises;
     const path = require('path');

     const app = express();

     // Middleware
     app.use(cors());
     app.use(express.static('public')); // Serve static files
     app.use('/uploads', express.static('uploads'));

     // Create uploads directory if it doesn't exist
     const uploadsDir = path.join(__dirname, 'uploads');
     (async () => {
         try {
             await fs.access(uploadsDir);
         } catch {
             await fs.mkdir(uploadsDir);
         }
     })();

     // Multer setup for file uploads
     const storage = multer.diskStorage({
         destination: (req, file, cb) => {
             cb(null, 'uploads/');
         },
         filename: (req, file, cb) => {
             cb(null, Date.now() + path.extname(file.originalname));
         }
     });
     const upload = multer({
         storage,
         fileFilter: (req, file, cb) => {
             if (file.mimetype === 'audio/mpeg') {
                 cb(null, true);
             } else {
                 cb(new Error('Only MP3 files are allowed'), false);
             }
         }
     });

     // Load music metadata
     async function loadMusic() {
         try {
             const data = await fs.readFile('music.json', 'utf8');
             return JSON.parse(data);
         } catch {
             return [];
         }
     }

     // Save music metadata
     async function saveMusic(music) {
         await fs.writeFile('music.json', JSON.stringify(music, null, 2), 'utf8');
     }

     // Routes
     app.get('/', (req, res) => {
         res.sendFile(path.join(__dirname, 'public', 'index.html'));
     });

     app.get('/api/music', async (req, res) => {
         const music = await loadMusic();
         res.json(music);
     });

     app.post('/api/upload', upload.single('audioFile'), async (req, res) => {
         const { title, artist, genre, type } = req.body;
         if (!title || !artist || !req.file) {
             return res.status(400).json({ error: 'Missing required fields' });
         }

         const music = await loadMusic();
         music.push({
             title,
             artist,
             genre,
             type,
             audioUrl: `/uploads/${req.file.filename}`
         });
         await saveMusic(music);

         res.json({ message: 'Upload successful' });
     });

     module.exports = app; // Export for Vercel