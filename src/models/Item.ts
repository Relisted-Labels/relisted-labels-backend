import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import Category from "./Category";
import Brand from './Brand'


class Item extends Model {
  public id!: number;
  public owner_id!: number;
  public owner_name!: string;
  public item_pictures!: string[];
  public item_type!: string;
  public item_size!: string;
  public tags!: string[];
  public brand_id!: number;
  public category_id!: number;
  public status!: string;
  public item_name!: string;
  public item_description!: string;
  public color!: string;
  public daily_price!: number;
  public weekly_price!: number;
  public monthly_price!: number;
  public cleaning_fee!: number;
  public transport_fee!: number;
  public minimum_rental_period!: number;

  static associate(models: any) {
    Item.belongsTo(models.User, { foreignKey: 'owner_id' });
    Item.belongsTo(models.Brand, { foreignKey: 'brand_id' });
    Item.belongsTo(models.Category, { foreignKey: 'category_id' });
    Item.belongsTo(models.DressType, { foreignKey: 'item_type' });
  }
  public static async createItem(
    owner_id: number,
    owner_name: string,
    item_pictures: string[],
    item_type: string,
    item_size: string,
    tags: string[],
    brand_id: number,
    category_id: number,
    status: string,
    item_name: string,
    item_description: string,
    color: string,
    daily_price: number,
    weekly_price: number,
    monthly_price: number,
    cleaning_fee: number,
    transport_fee: number,
    minimum_rental_period: number[]
  ): Promise<Item | null> {
    try {
      const newItem = await Item.create({
        owner_id,
        owner_name,
        item_pictures,
        item_type,
        item_size,
        tags,
        brand_id,
        category_id,
        status,
        item_name,
        item_description,
        color,
        daily_price,
        weekly_price,
        monthly_price,
        cleaning_fee,
        transport_fee,
        minimum_rental_period,
      });
  
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      return null; // Return null on error
    }
  }

  public static async getItem(id: number): Promise<Item | null> {
    try {
    const item = await Item.findOne({
      where: { id: id },
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Brand,
          as: 'brand',
        },
        {
          model: User,
          as: 'owner',
        },
      ],
    });

    if (!item) {
      return null; // Item with the given ID doesn't exist
    }

    return item;
  } catch (error) {
    console.error('Error fetching item with details:', error);
    throw error; // Handle the error as needed
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
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
    }
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'name'
    }
    },
    item_pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    item_type: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'dress_types',
        key: 'name'
      }
    },
    item_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'brands',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    daily_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    weekly_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    monthly_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cleaning_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transport_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minimum_rental_period: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Item",
    tableName: "items",
    timestamps: true,
  }
);

export default Item;