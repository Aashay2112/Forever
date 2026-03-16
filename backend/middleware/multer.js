import multer from "multer";

// Storage configuration
const storage = multer.diskStorage({});

// File upload middleware
const upload = multer({ storage });

export default upload;