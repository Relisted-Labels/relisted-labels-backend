import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';
import Item from './Item';
import RefreshToken from './RefreshToken';
import UserProfile from './UserProfile';

class User extends Model {
  private id!: number;
  private username!: string;
  private password!: string;
  private email!: string;
  private is_onboarded!: boolean;
  private is_email_verified!: boolean;

  static associate(models: any) {
    User.hasMany(Item, {
      foreignKey: 'owner_id',
    });
    User.hasOne(RefreshToken);
    User.hasOne(UserProfile);

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

    static async getUserById(id: number): Promise<User | null> {
      try {
        const user = await User.findByPk(id);
        return user;
      } catch (error) {
        console.error('Error fetching user by id:', error);
        return null;
      }
    }

    async verifyUserEmail(): Promise<boolean> {
      try {
        this.is_email_verified = true;
        await this.save();
        return true;
      } catch (error) {
        console.error('Error verifying user email:', error);
        return false;
      }
    }


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
      this.password = newPassword;
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
  

  static async createAccount(username: string, email: string, password: string, isOnboarded: boolean, isEmailVerified: boolean): Promise<User | null> {
    try {
      const newUser = await User.create({
        username,
        email,
        password,
        is_onboarded: isOnboarded,
        is_email_verified: isEmailVerified,
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
    is_onboarded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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