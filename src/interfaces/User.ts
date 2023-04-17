import { Document } from "mongoose";

interface User extends Document {
    user_name: string;
    nick_name?: string;
    email: string;
    profile_color?: string;
}

interface UserIdWithToken {
    _id: string;
    token: string;
    role: 'admin' | 'user';
}

export { User, UserIdWithToken }
