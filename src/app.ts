import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/auth';

// This checks if the user is authorized
function isLoggedIn(req: any, res: any, next: any) {
  req.user ? next() : res.sendStatus(401);
};

const app = express();

app.use(express.json());

app.use('/auth', authRouter);

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
  '/google/callback',
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

// ... Other app configurations

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
