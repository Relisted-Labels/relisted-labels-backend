import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Import your Sequelize instance

class Brand extends Model {
  public id!: number;
  public name!: string;
  public featured!: boolean;

  static associate(models: any) {
    Brand.hasMany(models.Item, {
      foreignKey: 'brand_id',
    })
  }

  static async createBrand(name: string): Promise<Brand | null> {
    try {
      const newBrand = await this.create({ name });
      return newBrand;
    } catch (error) {
      console.error('Error creating Brand:', error);
      return null;
    }
  }

  static async getBrandById(BrandId: number): Promise<Brand | null> {
    try {
      return await Brand.findByPk(BrandId);
    } catch (error) {
      console.error('Error getting Brand by ID:', error);
      return null;
    }
  }

  static async updateBrand(brandId: number, updatedFields: Partial<Brand>): Promise<boolean> {
    try {
      const brand = await Brand.findByPk(brandId);
      if (brand) {
        Object.assign(brand, updatedFields);
        await brand.save();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating Brand:', error);
      return false;
    }
  }  

  static async getAllBrands(): Promise<Brand[]> {
    try {
      return await Brand.findAll();
    } catch (error) {
      console.error('Error getting all Brands:', error);
      return [];
    }
  }

  static async getBrandByName(BrandName: string): Promise<Brand | null> {
    try {
      return await Brand.findOne({ where: { name: BrandName } });
    } catch (error) {
      console.error('Error getting Brand by name:', error);
      return null;
    }
  }
}

Brand.init(
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
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false, // You can enable timestamps if needed
  }
);

export default Brand;
