import { Request, Response } from 'express';
import Item from '../models/Item';
import Collection from '../models/Collection';
import Category from '../models/Category';
import { SearchCriterion } from '../models/Item';


export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const item = await Item.getItemById(Number(itemId));
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

export const getItemsInCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collectionName } = req.params;
    const collection = await Collection.getCollectionByName(collectionName);
    if (collection) {
      const items = await Item.findAll({ where: { collection_id: collection.id } });
      res.json({ items });
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    console.error('Error getting items in collection:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

export const getItemsInCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryName } = req.params;
    const category = await Category.getCategoryByName(categoryName);
    if (category) {
      const items = await Item.findAll({ where: { category_id: category.id } });
      res.json({ items });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Error getting items in category:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};


export const searchItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { criterion, value } = req.body;

    let items = [];
    switch (criterion) {
      case SearchCriterion.UserName:
        items = await Item.searchItems({
          criterion: SearchCriterion.UserName,
          value,
        });
        break;
      case SearchCriterion.CategoryName:
        items = await Item.searchItems({
          criterion: SearchCriterion.CategoryName,
          value,
        });
        break;
      case SearchCriterion.Tag:
        items = await Item.searchItems({
          criterion: SearchCriterion.Tag,
          value,
        });
        break;
      case SearchCriterion.DressType:
        items = await Item.searchItems({
          criterion: SearchCriterion.DressType,
          value,
        });
        break;
      case SearchCriterion.Location:
        items = await Item.searchItems({
          criterion: SearchCriterion.Location,
          value,
        });
        break;
      default:
        res.status(400).json({ message: 'Invalid search criterion' });
        return;
    }

    res.json({ items });
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

