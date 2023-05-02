import mongoose from 'mongoose';
import { AlbumDatabase } from '../../interfaces/Album';

const albumModel = new mongoose.Schema<AlbumDatabase>({
    name: {
        type: String,
        required: true
    },
    cover: {
        type: String
    },
    description: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model<AlbumDatabase>('Album', albumModel);
