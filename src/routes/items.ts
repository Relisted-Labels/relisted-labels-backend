import express from 'express';
import { createItem, getItem } from '../controllers/ItemController';
import { upload } from '../config/multerConfig';
import { v2 as cloudinary } from 'cloudinary';
import { tokenVerification } from '../controllers/userController';


// Item creation and editing

/** 
 * Description: These are the routes relating to authorization. 
 * Login/Logout and all other authorization related routes will be handled here.
 */

v2.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

const uploadToCloudinary = async (req, res, next) => {
  try {
    const results = await Promise.all(
      req.files.map(async (file) => {
        const result = await v2.uploader.upload(file.path);
        return result.secure_url;
      })
    );
    req.cloudinaryUrls = results;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error uploading to Cloudinary' });
  }
};

const itemRouter = express.Router();
itemRouter.use(express.json());

itemRouter.post(
  '/create-item',
  tokenVerification,
  uploadToCloudinary, // Use the Cloudinary upload middleware
  createItem
);
itemRouter.get('/get-item', tokenVerification, getItem)
// itemRouter.get('/search:criterion:value', searchItems);

export default itemRouter;
