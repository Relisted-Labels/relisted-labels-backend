import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';
import Item from './Item';

class User extends Model {
  private id!: number;
  private username!: string;
  private passwordHash!: string;
  private email!: string;

  static associate(models: any) {
    User.hasMany(Item);
  }

  getId(): number {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  async updateUsername(newUsername: string): Promise<boolean> {
    try {
      this.username = newUsername;
      await this.save();
      return true;
    } catch (error) {
      console.error('Error updating username:', error);
      return false;
    }  }


  async updateEmail(newEmail: string): Promise<boolean> {
    try {
      this.email = newEmail;
      await this.save();
      return true;
    } catch (error) {
      console.error('Error updating email:', error);
      return false;
    }
  }

  async updatePassword(newPassword: string): Promise<boolean> {
    try {
      this.passwordHash = newPassword;
      await this.save();
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  async deleteAccount(): Promise<boolean> {
    try {
      await this.destroy();
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.dataValues.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }


  static async getUserByIdentifier(identifier: string): Promise<User | null> {
    try {
      const condition = identifier.includes('@') ? { email: identifier } : { username: identifier };
      const user = await User.findOne({ where: condition });
  
      return user;
    } catch (error) {
      console.error('Error fetching user by identifier:', error);
      return null;
    }
  }
  

  static async createAccount(username: string, email: string, password: string): Promise<User | null> {
    try {
      const newUser = await User.create({
        username,
        email,
        password,
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user account:', error);
      return null;
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  }
);

export default User;