import jwt from 'jsonwebtoken';
import { unlink } from 'node:fs';
import express, {NextFunction, Request, Response} from 'express';
import sharp from 'sharp';
import multer, {FileFilterCallback} from 'multer';
import coverPost from '../controllers/uploadController';
import CustomError from '../../classes/CustomError';
import { UserIdWithToken } from '../../interfaces/User';
import auth from '../../auth';

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const authorizeUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userFromToken = await auth(req);

  if (userFromToken.role === 'user') {
    next(new CustomError('not authorized', 300));
    return;
  }
  next();
}

const makeThumbnail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const outputFile = req.file?.path + '_thumb'
    await sharp(req.file?.path)
      .resize(256, 256)
      .png()
      .toFile(outputFile);
    console.log(outputFile + ' created');
    next();
  } catch (error) {
    next(new CustomError('thumbnail not created', 500));
  }
};

const removeOriginal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    unlink(req.file?.path as string, (err) => {
    if (err) throw err;
      next();
    });
  } catch (error) {
    next(new CustomError('original not deleted', 500));
  }
}

const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

router
  .route('/')
  .post(
    authorizeUpload,
    upload.single('cover'),
    makeThumbnail,
    removeOriginal,
    coverPost
  );

export default router;