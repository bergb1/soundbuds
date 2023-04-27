import express from 'express';
import uploadRoute from './routes/uploadRoute';
import MessageResponse from '../interfaces/MessageResponse';

// Create a router
const router = express.Router();

// Assign the upload route
router.use('/upload', uploadRoute);

export default router;