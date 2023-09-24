import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path'; // Import the path module

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use path.join to create a relative path to the 'uploads' directory
    const uploadDir = path.join(__dirname, 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop(); // Get the file extension
    const filename = `${Date.now()}-${uuidv4()}.${fileExtension}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });
