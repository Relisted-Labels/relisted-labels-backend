import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as InstagramStrategy } from 'passport-instagram'

dotenv.config();

const GOOGLE_CLIENT_ID: string | undefined = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET: string | undefined = process.env.GOOGLE_CLIENT_SECRET;
const INSTAGRAM_CLIENT_ID: string | undefined = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET: string | undefined = process.env.INSTAGRAM_CLIENT_SECRET;
import { registerUser, loginUser, forgotPassword } from '../controllers/userController';

// Authorization Routes

/**
 * Description: These are the routes relating to authorization. 
 * Login/Logout and all other authorization related routes will be handled here.
 */

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET or both were not foun in the environment variable)")
} else {
    passport.use(
        new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/auth/google/callback',
            passReqToCallback: true,
        },
        (req, accessToken, refreshToken, profile, done) => {
            console.log(profile);
            
            // User should be created here
            // Check if the user already exists in your database
            // If not, create a new user using 'profile' data
            // Call 'done' with the user object to indicate success
            // Example:
            // User.findOne({ googleId: profile.id }, (err, user) => {
            //   if (err) return done(err);
            //   if (!user) {
            //     const newUser = new User({
            //       googleId: profile.id,
            //       displayName: profile.displayName,
            //     });
            //     newUser.save((err) => {
            //       if (err) return done(err);
            //       return done(null, newUser);
            //     });
            //   } else {
            //     return done(null, user);
            //   }
            // });
        }
        )
    );
};

if (!INSTAGRAM_CLIENT_ID || !INSTAGRAM_CLIENT_SECRET) {
    throw new Error("INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET or both were not foun in the environment variable)")
} else {
    passport.use(
        new InstagramStrategy(
        {
            clientID: INSTAGRAM_CLIENT_ID,
            clientSecret: INSTAGRAM_CLIENT_SECRET,
            callbackURL: "https://relisted-labels-frontend.vercel.app/auth",
            passReqToCallback: true,
        },
        (req, accessToken, refreshToken, profile, done) => {
            console.log(profile);
            
            // User should be created here (similar to Google OAuth)
        })
    );
};

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});

const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/forgot-password', forgotPassword);

export default authRouter;