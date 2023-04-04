import { NextFunction, Request, Response } from 'express';
import CustomError from './classes/CustomError';
import ErrorResponse from './interfaces/ErrorResponse';

// Not found handler
const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

// Error handler
const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
  ) => {
    console.error('errorHandler', err.message);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.stack,
    });
};

export { notFound, errorHandler }
