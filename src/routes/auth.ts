import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

// These should be environment variables
// const GOOGLE_CLIENT_ID: string | undefined = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET: string | undefined = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = '323186463910-4v9a3k031bka5cdfnjcs4tubumqinvvo.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

// Authorization Routes

/**
 * Description: These are the routes relating to authorization. 
 * Login/Logout and all other authorization related routes will be handled here.
 */

passport.use(
    new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID || '',
        clientSecret: GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http:/localhost:3000/google/callback',
        passReqToCallback: true,
    },
    (accessToken, refreshToken, profile: any, done: any) => {
        // For testing purposes
        return done(null, profile);

        // Create User in db: basically login or register
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return done(err, user);
        // });
    }
    )
);

const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

export default authRouter;

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});