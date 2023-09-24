import { Request, Response } from "express";0
import Item from "../models/Item";
import fs from 'fs';
import Collection from '../models/Brand';
import Category from '../models/Category';
// import { SearchCriterion } from '../models/Item';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url'



  // Function to delete uploaded images

const extractFilenameFromCloudinaryUrl = (imageUrl: string) => {
    const parts = imageUrl.split('/');
    console.log("Filename from Cloudinary URL:",parts[parts.length - 1])
    return parts[parts.length - 1];
};

const deleteItemFromLocalStorage = (publicID: string) => {
    // Extract the file extension from the public ID
    const parts = publicID.split('.');
    const fileExtension = parts[parts.length - 1];

    // Check if it's a jpg and replace it with jpeg
    if (fileExtension === "jpg") {
        const correctedPublicID = `${publicID.substring(0, publicID.lastIndexOf('.'))}.jpeg`;
        const fileName = `${correctedPublicID}`;
        const filePath = `./uploads/${fileName}`;

        // Check if a file with the "jpeg" extension exists
        if (fs.existsSync(filePath)) {
            const originalFilePath = `./uploads/${publicID}`;
            try {
                fs.unlinkSync(originalFilePath);
                console.log(`Local file ${fileName} deleted successfully.`);
            } catch (err : any) {
                console.error(`Error deleting local file ${fileName}: ${err.message}`);
            }
        } else {
            try {
                // If no file with the "jpeg" extension exists, delete the original, aka switch back to jpg

            } catch (err : any) {
                console.error(`Error deleting local file ${fileName}: ${err.message}`);
            }
        }
    } else {
        // For other file extensions, use the original public ID
        const fileName = `${publicID}.${fileExtension}`;
        const filePath = `./uploads/${fileName}`;

        try {
            fs.unlinkSync(filePath);
            console.log(`Local file ${fileName} deleted successfully.`);
        } catch (err: any) {
            console.error(`Error deleting local file ${fileName}: ${err.message}`);
        }
    }
};

export const deleteUploadedImages = async (imageUrls: string[]) => {
    for (const imageUrl of imageUrls) {
      try {
        // Extract the filename from the Cloudinary URL

        const filename = extractFilenameFromCloudinaryUrl(imageUrl);
  
        // Delete the item image from local storage
        deleteItemFromLocalStorage(filename);

        // Extract the public ID from the Cloudinary URL
        const publicID = extractPublicId(imageUrl);
  
        // Attempt to delete the image from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(publicID);

      if (cloudinaryResponse.result === 'ok') {
        console.log("Image deleted:", imageUrl);
      } else {
        console.error('Error deleting uploaded image from Cloudinary:', cloudinaryResponse.result);
      }
      } catch (error) {
        console.error('Error deleting uploaded image from Cloudinary:', error);
  
        return; // Exit the loop on error
      }  
    }
};
  
const uploadToCloudinary = async (req: Request, res: Response, next: Function) => {
  try {
    const results = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      })
    );
    req.cloudinaryUrls: string[] = results;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error uploading to Cloudinary' });
  }
};
export const createItem = async (req: Request, res: Response) => {
  try {
    const { owner_id, owner_name, item_type, item_size, tags, brand_id, category_id, item_name, item_description, color, daily_price, weekly_price,  monthly_price, cleaning_fee, transport_fee, minimal_rental_period  } = req.body;
    const imageFiles: Express.Multer.File[] = req.files as Express.Multer.File[] || [];
    console.log("File uploaded!!")

    if (!imageFiles) {
      return res.status(400).json({ success: false, message: 'No image files were uploaded' });
    }

    if (imageFiles.length > 5) {
      return res.status(400).json({ success: false, message: 'Cannot upload more than 5 images' });
    }

    const uploadedImages: string[] = [];

    for (const imageFile of imageFiles) {
      try {
        console.log("About to upload to cloudinary.")
        const result = await cloudinary.uploader.upload(imageFile.path, {
          folder: 'rl-dev',
          use_filename: true,
          unique_filename: false,
          resource_type: 'auto',
        });
        uploadedImages.push(result.secure_url);
        console.log("File uploaded:", result.secure_url);
      } catch (error) {
        // Handle the error (log or send a response)
        console.error('Error in Cloudinary:', error);
        // Rollback: Delete the uploaded images
        await deleteUploadedImages(uploadedImages);
        return res.status(500).json({ success: false, message: 'Error uploading image' });
      }
    }

    // Handle image upload and generate image_urls
    const imageUrls: string = uploadedImages.join(',');
    const status = "unverified";
    // Create the item with image_urls
    const newItem = await Item.createItem(
      owner_id,
      owner_name,
      category_id,
      imageUrls,
      brand_id,
      item_type,
      item_size,
      tags,
      status,
      item_name,
      item_description,
      color,
      daily_price,
      weekly_price,
      monthly_price,
      cleaning_fee,
      transport_fee,
      minimal_rental_period
    );

    if (newItem) {
      return res.status(201).json({ success: true, message: 'Item created successfully' });
    } else {
      // Rollback: Delete the uploaded images
      await deleteUploadedImages(uploadedImages);
      return res.status(500).json({ success: false, message: 'Error creating item' });
    }
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ success: false, message: 'Error creating item' });
  }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const item = await Item.getItem(Number(itemId));
    if (item) {
      res.json({ item });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error getting item by ID:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};
  
  // export const getItemsInCollection = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { collectionName } = req.params;
  //     const collection = await Collection.getCollectionByName(collectionName);
  //     if (collection) {
  //       const items = await Item.findAll({ where: { collection_id: collection.id } });
  //       res.json({ items });
  //     } else {
  //       res.status(404).json({ message: 'Collection not found' });
  //     }
  //   } catch (error) {
  //     console.error('Error getting items in collection:', error);
  //     res.status(500).json({ message: 'An error occurred' });
  //   }
  // };
  
  // export const getItemsInCategory = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { categoryName } = req.params;
  //     const category = await Category.getCategoryByName(categoryName);
  //     if (category) {
  //       const items = await Item.findAll({ where: { category_id: category.id } });
  //       res.json({ items });
  //     } else {
  //       res.status(404).json({ message: 'Category not found' });
  //     }
  //   } catch (error) {
  //     console.error('Error getting items in category:', error);
  //     res.status(500).json({ message: 'An error occurred' });
  //   }
  // };
  
  
  // export const searchItems = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { criterion, value } = req.params;
  //     console.log(criterion, value);
  
  //     if (!Object.values(SearchCriterion).includes(criterion as SearchCriterion)) {
  //      res.status(400).json({ message: 'Invalid search criterion' });
  //      return;
  //     }
  
  //     let items = [];
  //     switch (criterion) {
  //       case SearchCriterion.UserName:
  //         items = await Item.searchItems({
  //           criterion: SearchCriterion.UserName,
  //           value,
  //         });
  //         break;
  //       case SearchCriterion.CategoryName:
  //         items = await Item.searchItems({
  //           criterion: SearchCriterion.CategoryName,
  //           value,
  //         });
  //         break;
  //       case SearchCriterion.Tag:
  //         items = await Item.searchItems({
  //           criterion: SearchCriterion.Tag,
  //           value,
  //         });
  //         break;
  //       case SearchCriterion.DressType:
  //         items = await Item.searchItems({
  //           criterion: SearchCriterion.DressType,
  //           value,
  //         });
  //         break;
  //       case SearchCriterion.Location:
  //         items = await Item.searchItems({
  //           criterion: SearchCriterion.Location,
  //           value,
  //         });
  //         break;
  //         case SearchCriterion.ItemName:
  //         items = await Item.searchItems({
  //           criterion: SearchCriterion.ItemName,
  //           value,
  //         });
  //         break;
  //       default:
  //         res.status(400).json({ message: 'Invalid search criterion' });
  //         return;
  //     }
  
  //     res.json({ items });
  //   } catch (error) {
  //     console.error('Error searching items:', error);
  //     res.status(500).json({ message: 'An error occurred' });
  //   }
  // };