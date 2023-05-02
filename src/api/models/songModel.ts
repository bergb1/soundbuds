import mongoose from 'mongoose';
import { SongDatabase } from '../../interfaces/Song';

const songModel = new mongoose.Schema<SongDatabase>({
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
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }
});

export default mongoose.model<SongDatabase>('Song', songModel);
