import dotenv from 'dotenv';
dotenv.config();
import { upload } from './config/multerConfig';
import express from 'express';
import authRouter from './routes/auth';
import itemRouter from './routes/items';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { setConfig } from 'cloudinary-build-url'


const app = express();
app.use(express.json());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

setConfig({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
})

const corsOptions = {
  origin: true, // Add other allowed origins as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Set the appropriate success status for preflight requests
};

// Enable CORS for all routes or for specific routes as needed
app.use(cors(corsOptions));
app.use('/auth', authRouter);
app.use('/items', itemRouter);

// ... Other app configurations

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
