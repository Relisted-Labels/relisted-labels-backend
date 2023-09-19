import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class UserProfile extends Model {
    public id!: number;
    public user_id!: number;
    public location!: string;
    public profile_picture!: string;
    public gender!: string;
    public bio!: string;
    public is_verified!: boolean;

    static associate(models: any) {
        UserProfile.belongsTo(models.User, { foreignKey: 'user_id' });
    }

    public async destroy(): Promise<void> {
        try {
            await this.destroy();
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    }

    static async createProfile(userId: number, location: string, profile_picture: string, gender: string, bio: string, is_verified: boolean): Promise<UserProfile | null> {
        try {
            const newProfile = await UserProfile.create({
                user_id: userId,
                location,
                profile_picture,
                gender,
                bio,
                is_verified
            });
            return newProfile;
        } catch (error) {
            console.error('Error creating profile:', error);
            return null;
        }
    }

    static async getProfileByUserId(userId: number): Promise<UserProfile | null> {
        try {
            const profile = await UserProfile.findOne({ where: { user_id: userId } });
            return profile;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    }

    static async updateProfileByUserId(userId: number, updates: Partial<UserProfile>): Promise<boolean> {
        try {
            const [updatedRows] = await UserProfile.update(updates, { where: { user_id: userId } });
            return updatedRows > 0;
        } catch (error) {
            console.error('Error updating profile:', error);
            return false;
        }
    }

    getProfilePicture(): string {
        return this.profile_picture;
    }

    setProfilePicture(newProfilePicture: string): void {
        try {
            this.profile_picture = newProfilePicture;
            this.save();
        } catch (error) {
            console.log('Error updating profile picture:', error);
        }
    }

    getGender(): string {
        return this.gender;
    }

    setGender(newGender: string): void {
        try {
            this.gender = newGender;
            this.save();
        } catch (error) {
            console.log('Error updating gender:', error);
        }
    }

    getBio(): string {
        return this.bio;
    }

    setBio(newBio: string): void {
        try {
            this.bio = newBio;
            this.save(); 
        } catch (error) {
            console.log('Error updating bio:', error);
        }
    }

    // Getter and setter methods for 'is_verified' property
    getIsVerified(): boolean {
        return this.is_verified;
    }

    setIsVerified(newIsVerified: boolean): void {
        try {
            this.is_verified = newIsVerified;
            this.save();
        } catch (error) {
            console.log('Error updating verified status:', error);
        }
    }

    getLocation(): string {
        return this.location;
    }

    // Setter method for the 'location' property
    setLocation(newLocation: string): void {
        try {
            this.location = newLocation;
        } catch (error) {
            console.log('Error updating location:', error);
        }
    }

}

UserProfile.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    timestamps: false
})



export default UserProfile;