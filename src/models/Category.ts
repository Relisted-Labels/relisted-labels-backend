import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Category extends Model {
    id!: number;
    name!: string;


    static async createCategory(name: string): Promise<Category | null> {
        try {
            const newCategory = await Category.create({
                name,
            });
            return newCategory;
        } catch (error) {
            console.error('Error creating user account:', error);
            return null;
        }
    }

    static async fetchCategories(): Promise<Category[] | null> {
        try {
            const categories = await Category.findAll();
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    }

    static async getCategoryByName(categoryName: string): Promise<Category | null> {
        try {
          return await Category.findOne({ where: { name: categoryName } });
        } catch (error) {
          console.error('Error getting category by name:', error);
          return null;
        }
      }
}

Category.init(
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
        modelName: 'Category',
        tableName: 'categories',
        timestamps: false,
    }
)

export default Category;