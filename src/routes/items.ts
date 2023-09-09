import express from 'express';
import { createItem, searchItems } from '../controllers/ItemController';
import { upload } from '../config/multerConfig';

// Item creation and editing

/**
 * Description: These are the routes relating to authorization. 
 * Login/Logout and all other authorization related routes will be handled here.
 */

const itemRouter = express.Router();
itemRouter.use(express.json());

itemRouter.post('/createItem', upload.array('images', 5), createItem);
itemRouter.get('/search:criterion:value', searchItems);

export default itemRouter;