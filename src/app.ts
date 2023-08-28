import express, { Express, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import path from 'path';

// Initialize Express app
const app: Express = express();

// Set up static assets and view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Express session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

// Other routes and middleware can be added here

// Start the server
const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
