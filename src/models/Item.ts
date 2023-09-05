import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import User from './User';
import Category from './Category';
import Tags from './Tags';


export enum SearchCriterion {
    UserName = 'userName',
    CategoryName = 'categoryName',
    Tag = 'tag',
    DressType = 'dressType',
    Location = 'location',
}

interface ItemSearchCriteria {
    criterion: SearchCriterion;
    value: string;
}

class Item extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public category_id!: number;
  public owner_id!: number;
  public collection_id!: number;
  public image_url!: string | null; // Add this property
  public stock_quantity!: number;
  public price!: number;
  public rental_price!: number;
  public price_per_day!: number;
  public minimal_rental_period!: number;
  public is_available!: boolean;
  public location!: string;
  public created_at!: Date;
  public updated_at!: Date | null;

  static async createItem(
    title: string,
    description: string,
    category_id: number,
    owner_id: number,
    collection_id: number,
    image_url: string | null,
    stock_quantity: number,
    price: number,
    rental_price: number,
    price_per_day: number,
    minimal_rental_period: number,
    is_available: boolean,
    location: string
  ): Promise<Item | null> {
    try {
      const newItem = await this.create({
        title,
        description,
        category_id,
        owner_id,
        collection_id,
        image_url,
        stock_quantity,
        price,
        rental_price,
        price_per_day,
        minimal_rental_period,
        is_available,
        location,
      });

      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      return null;
    }
  }

  static async getItemById(itemId: number): Promise<Item | null> {
    try {
      return await Item.findByPk(itemId);
    } catch (error) {
      console.error('Error getting item by ID:', error);
      return null;
    }
  }


  static async searchItems(searchCriteria: ItemSearchCriteria): Promise<Item[]> {
    try {
        const whereClause: any = {};

        switch (searchCriteria.criterion) {
            case SearchCriterion.UserName:
                whereClause['$User.username$'] = {
                    [Op.like]: `%${searchCriteria.value}%`,
                };
                break;

            case SearchCriterion.CategoryName:
                whereClause['$Category.name$'] = {
                    [Op.like]: `%${searchCriteria.value}%`,
                };
                break;

            case SearchCriterion.Tag:
                whereClause['$Tags.name$'] = {
                    [Op.like]: `%${searchCriteria.value}%`,
                };
                break;

            case SearchCriterion.DressType:
                whereClause['dress_type'] = {
                    [Op.like]: `%${searchCriteria.value}%`,
                };
                break;

            case SearchCriterion.Location:
                whereClause['location'] = {
                    [Op.like]: `%${searchCriteria.value}%`,
                };
                break;

            default:
                throw new Error('Invalid search criterion');
        }

        // Perform the search query
        const items = await Item.findAll({
            where: whereClause,
            include: [
                // Include User, Category, and Tags models to access their attributes
                { model: User, as: 'User', attributes: ['username'] },
                { model: Category, as: 'Category', attributes: ['name'] },
                { model: Tags, as: 'Tags', attributes: ['name'] },
            ],
        });

        return items;
    } catch (error) {
        console.error('Error searching items:', error);
        return [];
    }
}

  static async updateItem(
    itemId: number,
    updatedFields: Partial<Item>
): Promise<boolean> {
    try {
        const item = await Item.findByPk(itemId);
        if (item) {
            Object.assign(item, updatedFields);
            await item.save();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating item:', error);
        return false;
    }
}

  static async getItemsByOwner(ownerId: number): Promise<Item[]> {
    try {
      return await Item.findAll({ where: { owner_id: ownerId } });
    } catch (error) {
      console.error('Error getting items by owner:', error);
      return [];
    }
  }

  static async getAvailableItems(): Promise<Item[]> {
    try {
      return await Item.findAll({ where: { is_available: true } });
    } catch (error) {
      console.error('Error getting available items:', error);
      return [];
    }
  }
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id',
      },
    },
    owner_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    collection_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Collection',
        key: 'id',
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
    rental_price: {
      type: DataTypes.DECIMAL,
    },
    price_per_day: {
      type: DataTypes.DECIMAL,
    },
    minimal_rental_period: {
      type: DataTypes.INTEGER,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
    },
    location: {
      type: DataTypes.STRING(255),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
    timestamps: true
  }
);

export default Item;
