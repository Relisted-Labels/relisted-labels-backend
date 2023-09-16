// import { Request, Response } from "express";
// import Item from "../models/Item";
// import Collection from '../models/Collection';
// import Category from '../models/Category';
// import { SearchCriterion } from '../models/Item';

// export const createItem = async (req: Request, res: Response) => {
//     try {
//       const { title, description, category_id, owner_id, collection_id, stock_quantity, sale_type, price, rental_price, price_per_day, minimal_rental_period, is_available, location } = req.body;
//       const imageFiles: Express.Multer.File[] = req.files as Express.Multer.File[] || [];

//       // Handle image upload and generate image_urls
//       const imageUrls: string = imageFiles.map((file: Express.Multer.File) => {
//         return `/uploads/${file.filename}`;
//       }).join(',');

//       // Create the item with image_urls
//       const newItem = await Item.createItem(title, description, category_id, owner_id, collection_id, imageUrls, stock_quantity, sale_type, price, rental_price, price_per_day, minimal_rental_period, is_available, location);

//       if (newItem) {
//         return res.status(201).json({ success: true, message: 'Item created successfully' });
//       } else {
//         return res.status(500).json({ success: false, message: 'Error creating item' });
//       }
//     } catch (error) {
//       console.error('Error creating item:', error);
//       return res.status(500).json({ success: false, message: 'Error creating item' });
//     }
//   };



  
//   export const getItemById = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { itemId } = req.params;
//       const item = await Item.getItemById(Number(itemId));
//       if (item) {
//         res.json({ item });
//       } else {
//         res.status(404).json({ message: 'Item not found' });
//       }
//     } catch (error) {
//       console.error('Error getting item by ID:', error);
//       res.status(500).json({ message: 'An error occurred' });
//     }
//   };
  
//   export const getItemsInCollection = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { collectionName } = req.params;
//       const collection = await Collection.getCollectionByName(collectionName);
//       if (collection) {
//         const items = await Item.findAll({ where: { collection_id: collection.id } });
//         res.json({ items });
//       } else {
//         res.status(404).json({ message: 'Collection not found' });
//       }
//     } catch (error) {
//       console.error('Error getting items in collection:', error);
//       res.status(500).json({ message: 'An error occurred' });
//     }
//   };
  
//   export const getItemsInCategory = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { categoryName } = req.params;
//       const category = await Category.getCategoryByName(categoryName);
//       if (category) {
//         const items = await Item.findAll({ where: { category_id: category.id } });
//         res.json({ items });
//       } else {
//         res.status(404).json({ message: 'Category not found' });
//       }
//     } catch (error) {
//       console.error('Error getting items in category:', error);
//       res.status(500).json({ message: 'An error occurred' });
//     }
//   };
  
  
//   export const searchItems = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { criterion, value } = req.params;
//       console.log(criterion, value);
  
//       if (!Object.values(SearchCriterion).includes(criterion as SearchCriterion)) {
//        res.status(400).json({ message: 'Invalid search criterion' });
//        return;
//       }
  
//       let items = [];
//       switch (criterion) {
//         case SearchCriterion.UserName:
//           items = await Item.searchItems({
//             criterion: SearchCriterion.UserName,
//             value,
//           });
//           break;
//         case SearchCriterion.CategoryName:
//           items = await Item.searchItems({
//             criterion: SearchCriterion.CategoryName,
//             value,
//           });
//           break;
//         case SearchCriterion.Tag:
//           items = await Item.searchItems({
//             criterion: SearchCriterion.Tag,
//             value,
//           });
//           break;
//         case SearchCriterion.DressType:
//           items = await Item.searchItems({
//             criterion: SearchCriterion.DressType,
//             value,
//           });
//           break;
//         case SearchCriterion.Location:
//           items = await Item.searchItems({
//             criterion: SearchCriterion.Location,
//             value,
//           });
//           break;
//           case SearchCriterion.ItemName:
//           items = await Item.searchItems({
//             criterion: SearchCriterion.ItemName,
//             value,
//           });
//           break;
//         default:
//           res.status(400).json({ message: 'Invalid search criterion' });
//           return;
//       }
  
//       res.json({ items });
//     } catch (error) {
//       console.error('Error searching items:', error);
//       res.status(500).json({ message: 'An error occurred' });
//     }
//   };
  
  

