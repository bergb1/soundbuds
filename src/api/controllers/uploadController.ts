import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import UploadMessageResponse from '../../interfaces/UploadMessageResponse';

// - coverPost - upload a cover to the client
const coverPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check if there is a file
        if (!req.file) {
            throw new CustomError('file not valid', 400);
        }

        // Create a response
        const output: UploadMessageResponse = {
            message: 'cover uploaded',
            data: {
                filename: `/images/${req.file.filename}_thumb.jpg`
            }
        }
        res.json(output);
    } catch (err) {
        next(new CustomError((err as Error).message, 500));
    }
}

// - profilePost - upload a profile picture for the user
const profilePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check if there is a file
        if (!req.file) {
            throw new CustomError('file not valid', 400);
        }

        // Create a response
        const output: UploadMessageResponse = {
            message: 'profile picture uploaded',
            data: {
                filename: `/images/${req.file.filename}_profile.jpg`
            }
        }
        res.json(output);
    } catch (err) {
        next(new CustomError((err as Error).message, 500));
    }
}

// Manage export
export { coverPost, profilePost }