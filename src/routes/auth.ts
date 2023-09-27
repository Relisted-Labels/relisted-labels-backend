import express from 'express';
import { registerUser, loginUser, forgotPassword, signInWithGoogle, startVerifyUserEmail, tokenVerification, endVerifyUserEmail, resetPassword } from '../controllers/userController';
import passport from 'passport';
import User from '../models/User';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import RefreshToken from '../models/RefreshToken';
import AccessTokenGenerator from '../models/AccessToken';
// Authorization Routes

/**
 * Description: These are the routes relating to authorization. 
 * Login/Logout and all other authorization related routes will be handled here.
 */
const AGT = new AccessTokenGenerator();
const GOOGLE_CLIENT_ID: string | undefined = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET: string | undefined = process.env.GOOGLE_CLIENT_SECRET;
const INSTAGRAM_CLIENT_ID: string | undefined = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET: string | undefined = process.env.INSTAGRAM_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET or both were not foun in the environment variable)")
} else {
    passport.use(
        new GoogleStrategy(
          {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/auth/google/login',
            passReqToCallback: true,
          },
          signInWithGoogle
        )
      );
};

const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
authRouter.post('/google/login', passport.authenticate('google', {
    successRedirect: 'https://relisted-labels-frontend.vercel.app/listings',
    failureRedirect: '/auth/failure',
  }));
authRouter.post('/token-verification', tokenVerification);
authRouter.post('/verify-user-email/start', startVerifyUserEmail);
authRouter.post('/verify-user-email/end', endVerifyUserEmail);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

export default authRouter;