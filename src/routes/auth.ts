import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';

// Authorization Routes

/**
 * Description: These are the routes relating to authorization. 
 * Login/Logout and all other authorization related routes will be handled here.
 */

const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

export default authRouter;