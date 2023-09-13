import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import User from './User';
import Category from './Category';
import Tags from './Tags';
import Collection from './Collection';


export enum SearchCriterion {
    UserName = 'userName',
    CategoryName = 'categoryName',
    Tag = 'tag',
    DressType = 'dressType',
    Location = 'location',
    ItemName = 'title',
};
interface ItemSearchCriteria {
    criterion: SearchCriterion;
    value: string;
}

class Item extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public category_id!: number;
  public user_id!: number;
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

  static associate(models: any) {
    Item.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
    Item.belongsTo(Collection, { foreignKey: 'collection_id', as: 'collection' });
    Item.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  }
  
  static async createItem(
    title: string,
    description: string,
    category_id: number,
    user_id: number,
    collection_id: number,
    image_url: string | null,
    stock_quantity: number,
    sale_type: string,
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
        user_id,
        collection_id,
        image_url,
        stock_quantity,
        sale_type,
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
          whereClause['$owner.username$'] = {
            [Op.like]: `%${searchCriteria.value}%`,
          };
          break;
  
        case SearchCriterion.CategoryName:
          whereClause['$category.name$'] = {
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
  
        case SearchCriterion.ItemName:
          whereClause['title'] = {
            [Op.like]: `%${searchCriteria.value}%`,
          };
          break;
  
        default:
          throw new Error('Invalid search criterion');
      }
  
      const items = await Item.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'owner', attributes: ['username'] },
          { model: Category, as: 'category', attributes: ['name'] },
          { model: Collection, as: 'collection', attributes: ['name'] },
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
      return await Item.findAll({ where: { user_id: ownerId } });
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
    user_id: {
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
    sale_type: {
      type: DataTypes.ENUM('Rent Only', 'Rent or Purchase', 'Purchase Only'),
      allowNull: false,
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
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
