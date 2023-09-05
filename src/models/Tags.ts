import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Tags extends Model {
  public id!: number;
  public name!: string;


  static async createTag(name: string) {
    try {
      const newTag = await this.create({ name });
      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      return null;
    }
  }

  static async getTagById(tagId: number) {
    try {
      return await Tags.findByPk(tagId);
    } catch (error) {
      console.error('Error getting tag by ID:', error);
      return null;
    }
  }

  static async listTags(): Promise<Tags[]> {
    try {
      const tags = await Tags.findAll();
      return tags;
    } catch (error) {
      console.error('Error listing tags:', error);
      return [];
    }
  }
}

Tags.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Tags',
    tableName: 'tags',
    timestamps: false, // Adjust as needed
  }
);

export default Tags;