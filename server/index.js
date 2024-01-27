const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors')

const app = express();
const port = 3001;
app.use(cors(
  
    {
      origin: ["https://upload-six-pi.vercel.app/"],
      methods: ["POST", "GET"],
      credentials: true
  }
  
))
// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://romnick:1234@romnickdb.e14diyv.mongodb.net/up', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a mongoose model for your images (adjust as needed)
const Image = mongoose.model('Image', {
  filename: String,
  path: String,
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(path.join(__dirname, 'uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename
  }
});

const upload = multer({ storage: storage });

// POST endpoint for file upload
app.post('/uploads', upload.single('file'), async (req, res) => {
  // Access uploaded image details using req.file
  console.log(req.file.filename)
  // Save image details to MongoDB
  const newImage = new Image({
    filename: req.file.filename,
    path: req.file.path,
  });
  await newImage.save();

  res.json({ message: 'Image uploaded successfully' });
});

// Serve uploaded files statically (optional)
app.use('/upload', express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
