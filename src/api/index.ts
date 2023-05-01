import express from 'express';
import uploadRoute from './routes/uploadRoute';

// Create a router
const router = express.Router();

// Assign the upload route
router.use('/upload', uploadRoute);

export default router;