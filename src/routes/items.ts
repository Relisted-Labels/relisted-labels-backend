import express from 'express';
import { createItem, getItem } from '../controllers/ItemController';
import { upload } from '../config/multerConfig';
import { tokenVerification } from '../controllers/userController';


// Item creation and editing

/** 
 * Description: These are the routes relating to authorization. 
 * Login/Logout and all other authorization related routes will be handled here.
 */


const itemRouter = express.Router();
itemRouter.use(express.json());

itemRouter.post(
  '/create-item',
  tokenVerification,
  upload.array('images', 5),
  createItem
);
itemRouter.get('/get-item', tokenVerification, getItem)
// itemRouter.get('/search:criterion:value', searchItems);

export default itemRouter;