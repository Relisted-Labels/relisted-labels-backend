import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRouter from './routes/auth';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);

// ... Other app configurations

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
