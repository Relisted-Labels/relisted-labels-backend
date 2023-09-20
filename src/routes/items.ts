import express from 'express';
// import { createItem, searchItems } from '../controllers/ItemController';
import { upload } from '../config/multerConfig';
import Item from '../models/Item';
import Review from '../models/Review';

// // Item creation and editing

// /**
//  * Description: These are the routes relating to authorization. 
//  * Login/Logout and all other authorization related routes will be handled here.
//  */

const itemRouter = express.Router();
itemRouter.use(express.json());

// itemRouter.post('/createItem', upload.array('images', 5), createItem);
// itemRouter.get('/search:criterion:value', searchItems);
itemRouter.get('/:item_id/ratings', async (req, res) => {
    try {
        const item = await Item.getItemById(parseInt(req.params.item_id));
        if (item != null) {
            try {
                const reviews = Review.getReviewsByItem(item.id);
                return reviews;
            } catch (error) {
                return console.error('Error, fetching reviews:', error);
            }
        } else {
            return console.error('Error, fetching reviews" Item returned null!');
        }
    } catch (error) {
        return console.error('Error, fetching item:', error);
    }
})

export default itemRouter;