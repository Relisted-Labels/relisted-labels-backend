import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'secret';

class RefreshToken extends Model {
    public id!: number;
    public token!: string;
    public userId!: number;

    static associate(models: any) {
        RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
    }

    public async destroy(): Promise<void> {
        try {
            await this.destroy();
        } catch (error) {
            console.error('Error deleting token:', error);
        }
    }

    public static async createToken(userId: number): Promise<RefreshToken | null> {

        try {
            const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
            const newToken = await RefreshToken.create({
                userId,
                token
              });
            return newToken;    
        } catch (error) {
           console.log("Error creating token:", error)
           return null;
        }
    
    }

    static async getTokenByUserId(userId: number): Promise<RefreshToken | null> {
        try {
            const token = await RefreshToken.findOne({ where: { userId } });
            return token;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    }

}

RefreshToken.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: false 
});

export default RefreshToken;