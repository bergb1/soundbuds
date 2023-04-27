import mongoose from 'mongoose';
import { PostDatabase } from '../../interfaces/Post';

const postModel = new mongoose.Schema<PostDatabase>({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    }
});

export default mongoose.model<PostDatabase>('Post', postModel);