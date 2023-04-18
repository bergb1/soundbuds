import mongoose from 'mongoose';
import { UserDatabase } from '../../interfaces/User';

const userModel = new mongoose.Schema<UserDatabase>({
    username: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    nickname: {
        type: String,
        required: false,
        unique: false
    },
    profile_color: {
        type: String,
        required: false,
        unique: false,
        default: 'cyan'
    },
    song_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: false,
        unique: false
    },
    album_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: false,
        unique: false
    }
});

export default mongoose.model<UserDatabase>('User', userModel);
