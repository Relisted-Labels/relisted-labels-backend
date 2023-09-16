import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify the directory where uploaded files should be stored
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop(); // Get the file extension
    const filename = `${Date.now()}-${uuidv4()}.${fileExtension}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });
