import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Import your Sequelize instance

class Collection extends Model {
  public id!: number;
  public name!: string;

  static async createCollection(name: string): Promise<Collection | null> {
    try {
      const newCollection = await this.create({ name });
      return newCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      return null;
    }
  }

  static async getCollectionById(collectionId: number): Promise<Collection | null> {
    try {
      return await Collection.findByPk(collectionId);
    } catch (error) {
      console.error('Error getting collection by ID:', error);
      return null;
    }
  }

  static async updateCollection(
    collectionId: number,
    updatedFields: Partial<Collection>
  ): Promise<boolean> {
    try {
      const collection = await Collection.findByPk(collectionId);
      if (collection) {
        Object.assign(collection, updatedFields);
        await collection.save();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating collection:', error);
      return false;
    }
  }

  static async getAllCollections(): Promise<Collection[]> {
    try {
      return await Collection.findAll();
    } catch (error) {
      console.error('Error getting all collections:', error);
      return [];
    }
  }

  static async getCollectionByName(collectionName: string): Promise<Collection | null> {
    try {
      return await Collection.findOne({ where: { name: collectionName } });
    } catch (error) {
      console.error('Error getting collection by name:', error);
      return null;
    }
  }
}



Collection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Collection',
    tableName: 'collections',
    timestamps: false, // You can enable timestamps if needed
  }
);

export default Collection;
