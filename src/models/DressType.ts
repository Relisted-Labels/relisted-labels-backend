import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class DressType extends Model {
  public id!: number;
  public name!: string;


  static associate(models: any) {
    DressType.hasMany(models.Item, {
      foreignKey: 'item_type',
    })
  }

  static async createDressType(name: string) {
    try {
      const newDressType = await this.create({ name });
      return newDressType;
    } catch (error) {
      console.error('Error creating DressType:', error);
      return null;
    }
  }

  static async getDressTypeById(DressTypeId: number) {
    try {
      return await DressType.findByPk(DressTypeId);
    } catch (error) {
      console.error('Error getting DressType by ID:', error);
      return null;
    }
  }

  static async listDressType(): Promise<DressType[]> {
    try {
      const type = await DressType.findAll();
      return type;
    } catch (error) {
      console.error('Error listing DressType:', error);
      return [];
    }
  }
}

DressType.init(
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
    modelName: 'DressType',
    tableName: 'dress_types',
    timestamps: false, // Adjust as needed
  }
);

export default DressType;