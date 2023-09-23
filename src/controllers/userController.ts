import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import UserProfile from '../models/UserProfile';
import AccessTokenGenerator from '../models/AccessToken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as InstagramStrategy } from 'passport-instagram';

const jwtSecret = process.env.JWT_SECRET || 'secret';
const AGT = new AccessTokenGenerator();

export async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      res.status(400).json({ message: 'User with the same username or email already exists' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const isOnboarded = false;
    const isEmailVerified = false;

    const newUser = await User.createAccount(username, email, hashedPassword, isOnboarded, isEmailVerified);


    if (newUser) {
        const token = RefreshToken.createToken(newUser.getId());
        const accessToken = await AGT.generate(newUser.getId());
        res.status(201).json({ message: "Account created successfully! Please verify your email then go through the onboarding stages.", token: accessToken, isOnboarded: isOnboarded, isEmailVerified: false });

    } else {
      res.status(500).json({ error: 'Failed to create user account' });
    }
  } catch (error) {
    console.error('Error creating user account:', error);
   res.status(500).json({ message: 'An error occurred' });
  }
}

export async function startVerifyUserEmail(req: Request, res: Response): Promise<void> {
  const { userId, email } = req.body;
  const verifyToken = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  const verifyLink = jwt.sign({ userId, verifyToken }, jwtSecret, { expiresIn: '10m' });
  const emailText = `<p>Welcome to Relisted Labels! This is a fashion forward platform that promotes re-use and upcycling of African styles, that will make you look like a glamorous African Queen!</p><p>To verify your email, click on the link below:</p><p><a href="http://relisted-labels-frontend.vercel.app/verifyEmail/${verifyLink}">Verify Email</a></p>. This token expires in 10 minutes, btw. Goodluck!`;
  try {
    await sendEmail(email, 'Verify your email', emailText);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

export async function endVerifyUserEmail(req: Request, res: Response): Promise<void> {
  const { verifyToken, userId } = req.body;

  try {
    const decodedToken = jwt.verify(verifyToken, jwtSecret) as { userId: number; verifyToken: string, exp: number };
    const now = Math.floor(Date.now() / 1000);

    if (decodedToken.userId === userId && decodedToken.verifyToken && decodedToken.exp > now) {
      const user = await User.getUserById(userId);
      if (user) {
        user.verifyUserEmail();
        res.status(200).json({ message: 'Email verified successfully' });
      }
    } else {
      res.status(400).json({ message: 'Invalid or expired verification token' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'This token is either expired or invalid. Please try again.' });
  }
}


export async function loginUser(req: Request, res: Response): Promise<void> {
  const { identifier, password } = req.body;
  try {
    let user = await User.getUserByIdentifier(identifier);
    if (user) {
      if (await user.checkPassword(password)) {

        // Retrieve the user's ID
        const userId = user.getId();

        const existingRefreshToken = await RefreshToken.findOne({
          where: {
            userId,
          },
        });

        // If there's an existing refresh token, delete it
        if (existingRefreshToken) {
          await existingRefreshToken.destroyToken();
        }

        const accessToken = await AGT.generate(userId);
        const refreshToken = RefreshToken.createToken(userId);

        res.status(200).json({ message: 'Login successful', accessToken });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export async function tokenVerification(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Always include the JWT in your headers!' });
  }

  try {
    const decodedToken = jwt.decode(token) as { exp: number; user: { id: number } };
    const expDate = decodedToken?.exp;
    const userId = decodedToken?.user.id;

    if (!expDate) {
      return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }
  
      if (expDate < Math.floor(Date.now() / 1000)) {
        const refreshToken = await RefreshToken.getTokenByUserId(userId);

        if (refreshToken) {
          const tokenIsValid = await refreshToken.checkTokenValidity();

          if (tokenIsValid) {
            const accessToken = await AGT.generate(userId);

              res.setHeader('Authorization', `Bearer ${accessToken}`);
              return next();
            } else {
              return res.status(404).json({ message: 'User not found' });
            }
          } else {
            return res.status(401).json({ message: 'Invalid or expired refresh token. Please login again.' });
          }
        } else {
          next();
        }
    }
  catch (error) {
    console.error('Error in tokenVerification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  return res.status(500).json({ message: 'Internal server error' });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    const userId = user.getId()
    const resetToken = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const resetLink = jwt.sign({ userId, resetToken }, jwtSecret, { expiresIn: '20m' });
    const emailText = `Hi there! A little birdie from Relisted Labels told me you forgot your password. No worries, we're here to help!

    To reset your password, click on the link below:
    <a href="https://example.com/reset-password?token=${resetLink}">Reset Password</a>
    
    This link will expire in 10 minutes, so don't wait too long! If you didn't request this password reset, please ignore this email.
    
    Thanks,
    The Relisted Labels Team
    `;

    try {
      await sendEmail(email, 'Reset Password - Relisted Labels', emailText);
      return res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error sending email' });
    }
  } else{
  return res.status(404).json({ message: 'User not found' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  let { token, password } = req.body;
  try {
    const decodedToken = jwt.verify(token, jwtSecret) as { userId: number; resetToken: string, exp: number };
    const now = Math.floor(Date.now() / 1000);

    if (decodedToken.userId && decodedToken.resetToken && decodedToken.exp > now) {
      const user = await User.getUserById(decodedToken.userId);
      if (user) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.updatePassword(hashedPassword);
        res.status(200).json({ message: 'Password reset successfully' });
      }
    } else {
      res.status(400).json({ message: 'Invalid or expired token. Please try again.' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'An error occurred' });
  };
}