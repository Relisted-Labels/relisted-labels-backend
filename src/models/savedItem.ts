import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import User from './User';
import Item from './Item';


export enum SearchCriterion {
    UserName = 'userName',
    ItemName = 'itemName'
};
interface SavedItemSearchCriteria {
    criterion: SearchCriterion;
    value: string;
}

class SavedItem extends Model {
  public id!: number;
  public user_id!: number;
  public item_id!: number;
  public created_at!: Date;

  static associate(models: any) {
    SavedItem.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
    SavedItem.belongsTo(Item, { foreignKey: 'item_id', as: 'saved_item' });
  }
  getUserId(): number {
    return this.user_id;
  }

  getItemId(): number {
    return this.item_id;
  }
  
  static async createSavedItem(
    user_id: number,
    item_id: number
  ): Promise<SavedItem | null> {
    try {
      const newSavedItem = await this.create({
        user_id,
        item_id
      });

      return newSavedItem;
    } catch (error) {
      console.error('Error saving item:', error);
      return null;
    }
  }

  static async getSavedItemById(savedItemId: number): Promise<SavedItem | null> {
    try {
      return await SavedItem.findByPk(savedItemId);
    } catch (error) {
      console.error('Error getting savedItem by ID:', error);
      return null;
    }
  }


  static async searchSavedItems(searchCriteria: SavedItemSearchCriteria): Promise<SavedItem[]> {
    try {
      const whereClause: any = {};
  
      switch (searchCriteria.criterion) {
        case SearchCriterion.UserName:
          whereClause['$owner.username$'] = {
            [Op.like]: `%${searchCriteria.value}%`,
          };
          break;
  
        case SearchCriterion.ItemName:
          whereClause['$saved_item.name$'] = {
            [Op.like]: `%${searchCriteria.value}%`,
          };
          break;

        default:
          throw new Error('Invalid search criterion');
      }
  
      const savedItems = await SavedItem.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'owner', attributes: ['username'] },
          { model: Item, as: 'saved_item', attributes: ['name'] }
        ],
      });
  
      return savedItems;
    } catch (error) {
      console.error('Error searching savedItems:', error);
      return [];
    }
  }

  static async getSavedItemsByItem(itemId: number): Promise<SavedItem[]> {
    try {
      return await SavedItem.findAll({ where: { item_id: itemId } });
    } catch (error) {
      console.error('Error getting savedItems by item:', error);
      return [];
    }
  }
}

SavedItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Item',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SavedItem',
    tableName: 'savedItems',
    timestamps: true
  }
);

export default SavedItem;