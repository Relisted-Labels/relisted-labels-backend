import dotenv from 'dotenv';
dotenv.config();
import { upload } from './config/multerConfig';
import express from 'express';
import authRouter from './routes/auth';
import itemRouter from './routes/items';
import cors from 'cors'

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(200);
  }
  next();
});

const corsOptions = {
  origin: true, //for now
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
};

// Enable CORS for all routes or for specific routes as needed
app.use(cors(corsOptions));


app.use('/auth', authRouter);
app.use('/items', itemRouter);

// ... Other app configurations

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
