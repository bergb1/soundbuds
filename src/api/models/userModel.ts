import mongoose from 'mongoose';
import { UserDatabase } from '../../interfaces/User';

const userModel = new mongoose.Schema<UserDatabase>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    nickname: {
        type: String
    },
    profile_color: {
        type: String,
        default: 'cyan'
    },
    song_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    },
    album_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }
});

export default mongoose.model<UserDatabase>('User', userModel);
