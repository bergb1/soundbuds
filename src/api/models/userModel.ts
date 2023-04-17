import mongoose from 'mongoose';
import { UserDatabase } from '../../interfaces/User';

const userModel = new mongoose.Schema<UserDatabase>({
    user_name: {
        type: String,
        required: true,
        unique: false
    },
    nick_name: {
        type: String,
        required: false,
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
    profile_color: {
        type: String,
        required: false,
        unique: false,
        default: 'cyan'
    }
});

export default mongoose.model<UserDatabase>('User', userModel);
