import { unlink } from 'node:fs';
import express, {NextFunction, Request, Response} from 'express';
import sharp from 'sharp';
import multer, {FileFilterCallback} from 'multer';
import { coverPost, profilePost } from '../controllers/uploadController';
import CustomError from '../../classes/CustomError';
import auth from '../../auth';

const authorizeUpload = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userFromToken = await auth(req);

  if (userFromToken.role === 'user') {
    next(new CustomError('not authorized', 300));
    return;
  }
  next();
}

const fileFilter = (
  _request: Request,
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
  _res: Response,
  next: NextFunction
) => {
  try {
    const outputFile = req.file?.path + '_thumb.jpg'
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

const makeProfile = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const outputFile = req.file?.path + '_profile.jpg'
    await sharp(req.file?.path)
      .resize(256, 256)
      .png()
      .toFile(outputFile);
    console.log(outputFile + ' created');
    next();
  } catch (err) {
    next(new CustomError('profile not created', 500));
  }
}

const removeOriginal = async (
  req: Request,
  _res: Response,
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

const router = express.Router();
const upload = multer({dest: './uploads/', fileFilter});

router
  .route('/cover')
  .post(
    authorizeUpload,
    upload.single('cover'),
    makeThumbnail,
    removeOriginal,
    coverPost
  );

router
  .route('/profile')
  .post(
    upload.single('profile'),
    makeProfile,
    removeOriginal,
    profilePost
  );

export default router;
