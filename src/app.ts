import dotenv from 'dotenv';
dotenv.config();
import { upload } from './config/multerConfig';
import express from 'express';
import authRouter from './routes/auth';
import itemRouter from './routes/items';

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/items', itemRouter);

// ... Other app configurations

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
