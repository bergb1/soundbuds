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
        console.log(req.file?.path);
        await sharp(req.file?.path)
            .resize(256, 256)
            .png()
            .toFile(req.file?.path + '_thumb');
        next();
    } catch (error) {
        next(new CustomError('Thumbnail not created', 500));
    }
};

const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

router
    .route('/')
    .post(
        upload.single('cover'),
        makeThumbnail,
        coverPost
    );

export default router;