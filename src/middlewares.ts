import { NextFunction, Request, Response } from 'express';
import CustomError from './classes/CustomError';

// Not found handler
const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).end();
};

// Error handler
const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error('errorHandler', err.message);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? 'Not in production' : err.stack,
    });
};

export { notFound, errorHandler }
