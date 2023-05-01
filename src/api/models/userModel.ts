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
        enum: ['user', 'creator', 'admin', 'root'],
        default: 'user'
    },
    profile: {
        type: String
    },
    nickname: {
        type: String
    },
    profile_color: {
        type: String,
        default: 'cyan'
    },
    favorite_song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    },
    favorite_album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }
});

export default mongoose.model<UserDatabase>('User', userModel);
