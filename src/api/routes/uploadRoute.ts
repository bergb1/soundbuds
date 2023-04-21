import { unlink } from 'node:fs';
import express, {NextFunction, Request, Response} from 'express';
import sharp from 'sharp';
import multer, {FileFilterCallback} from 'multer';
import coverPost from '../controllers/uploadController';
import CustomError from '../../classes/CustomError';

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
      console.log(req.file?.path + ' was deleted');
    });
    next();
  } catch (error) {
    next(new CustomError('original not deleted', 500));
  }
}

const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

router
    .route('/')
    .post(
        upload.single('cover'),
        makeThumbnail,
        removeOriginal,
        coverPost
    );

export default router;