import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET ?? 'default-secret';


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

    const newUser = await User.createAccount(username, email, hashedPassword);

    if (newUser) {
      const userWithoutPassword = { ...newUser.toJSON() };
        delete userWithoutPassword.password;
      const token = jwt.sign({ user: userWithoutPassword }, jwtSecret, { expiresIn: '1h' });

      res.status(201).json({ message: 'User account created successfully', token });
    } else {
      res.status(500).json({ message: 'Failed to create user account' });
    }
  } catch (error) {
    console.error('Error creating user account:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}



export async function loginUser(req: Request, res: Response): Promise<void> {
  const { identifier, password } = req.body;

  try {
    let user = await User.getUserByIdentifier(identifier);
    if (user) {
      if (await user.checkPassword(password)) {
        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;
        user = userWithoutPassword;
        const token = jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}


export function tokenVerification(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const expDate = (jwt.decode(token) as { exp: number })?.exp;
      let now = new Date().getTime() / 1000;

      if (expDate < now) {
        try {
          const verifyToken = jwt.verify(token, jwtSecret);
          next();
        } catch (error) {
          res.status(403).json({ message: 'Invalid token. Please login again.' });
        }

        next(); 
      } else {
        let user = jwt.decode(token);
        const userToken = jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });
        res.setHeader('Authorization', `Bearer ${userToken}`);
        next();
      }

    } else {
      res.status(401).json({ message: 'Always include the JWT in your headers!' });
    }
}
