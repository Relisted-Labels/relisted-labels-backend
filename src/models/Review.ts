import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import User from './User';
import Item from './Item';


export enum SearchCriterion {
    UserName = 'userName',
    ItemName = 'itemName'
};
interface ReviewSearchCriteria {
    criterion: SearchCriterion;
    value: string;
}

class Review extends Model {
  public id!: number;
  public rating!: number;
  public review!: string;
  public user_id!: number;
  public item_id!: number;
  public created_at!: Date;
  public updated_at!: Date | null;

  static associate(models: any) {
    Review.belongsTo(User, { foreignKey: 'user_id', as: 'writer' });
    Review.belongsTo(Item, { foreignKey: 'item_id', as: 'recipient' });
  }

  getRating(): number {
    return this.rating;
  }

  getUserId(): number {
    return this.user_id;
  }

  getItemId(): number {
    return this.item_id;
  }

  getReview(): string {
    return this.review;
  }
  
  static async createReview(
    rating: number,
    review: string,
    user_id: number,
    item_id: number
  ): Promise<Review | null> {
    try {
      const newReview = await this.create({
        rating,
        review,
        user_id,
        item_id
      });

      return newReview;
    } catch (error) {
      console.error('Error submitting review:', error);
      return null;
    }
  }

  static async getReviewById(reviewId: number): Promise<Review | null> {
    try {
      return await Review.findByPk(reviewId);
    } catch (error) {
      console.error('Error getting review by ID:', error);
      return null;
    }
  }


  static async searchReviews(searchCriteria: ReviewSearchCriteria): Promise<Review[]> {
    try {
      const whereClause: any = {};
  
      switch (searchCriteria.criterion) {
        case SearchCriterion.UserName:
          whereClause['$writer.username$'] = {
            [Op.like]: `%${searchCriteria.value}%`,
          };
          break;
  
        case SearchCriterion.ItemName:
          whereClause['$recipient.name$'] = {
            [Op.like]: `%${searchCriteria.value}%`,
          };
          break;

        default:
          throw new Error('Invalid search criterion');
      }
  
      const reviews = await Review.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'writer', attributes: ['username'] },
          { model: Item, as: 'recipient', attributes: ['name'] }
        ],
      });
  
      return reviews;
    } catch (error) {
      console.error('Error searching reviews:', error);
      return [];
    }
  }
  

  static async updateReview(
    reviewId: number,
    updatedFields: Partial<Review>
): Promise<boolean> {
    try {
        const review = await Review.findByPk(reviewId);
        if (review) {
            Object.assign(review, updatedFields);
            await review.save();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating review:', error);
        return false;
    }
}

  static async getReviewsByItem(itemId: number): Promise<Review[]> {
    try {
      return await Review.findAll({ where: { item_id: itemId } });
    } catch (error) {
      console.error('Error getting reviews by item:', error);
      return [];
    }
  }

  static async getAvailableReviews(): Promise<Review[]> {
    try {
      return await Review.findAll({ where: { is_available: true } });
    } catch (error) {
      console.error('Error getting available reviews:', error);
      return [];
    }
  }
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: true,
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
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true
  }
);

export default Review;