import dotenv from 'dotenv';
dotenv.config();
import { upload } from './config/multerConfig';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/auth';
import itemRouter from './routes/items';
import cors from 'cors';

// This checks if the user is authorized
function isLoggedIn(req: any, res: any, next: any) {
  req.user ? next() : res.sendStatus(401);
};

const app = express();
app.use(express.json());

// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     return res.sendStatus(200);
//   }
//   next();
// });

const corsOptions = {
  origin: true, // Add other allowed origins as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Set the appropriate success status for preflight requests
};

// Enable CORS for all routes or for specific routes as needed
app.use(cors(corsOptions));
app.use('/auth', authRouter);
app.use('/items', itemRouter);

app.get('/', (req, res) => {
  res.send('Hola!');
});

const SECRET = 'Jesusislordforever';
app.use(
  session({
    secret: SECRET || 'your-secret-key',
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Route for Google authentication
// i.e., route the user visits when they click on "Sign-in with Google"
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }) // The scopes are essentially the info we need from their account. Email and profile is good right?
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

// Redirect route after successful authentication
app.get('/protected', isLoggedIn, (req, res) => {
  res.send('Hola🙃');
});

// Redirect route after failed authentication
app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong☹');
});


// Route for Instagram authentication
// i.e., route the user visits when they click on "Sign-in with Google"
app.get(
  '/auth/instagram',
  passport.authenticate('instagram', { scope: ['user_profile', 'user_media'] }) // The scopes are essentially the info we need from their account. Email and profile is good right?
);

app.get(
  '/instagram/auth/callback',
  passport.authenticate('instagram', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

// // Redirect route after successful authentication
// app.get('/protected', isLoggedIn, (req, res) => {
//   res.send('Hola🙃');
// });

// // Redirect route after failed authentication
// app.get('/auth/failure', (req, res) => {
//   res.send('Something went wrong☹');
// });


// ... Other app configurations
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
