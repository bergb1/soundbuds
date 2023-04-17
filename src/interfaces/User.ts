import { Document } from "mongoose";

interface User {
    user_name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    nick_name?: string;
    profile_color?: string;
}

interface GraphQLUser extends Omit<User, 'role'>, Document {}

interface MongoUser extends User, Document {}

interface UserIdWithToken {
    _id: string;
    token: string;
    role: 'admin' | 'user';
}

export { User, GraphQLUser, MongoUser, UserIdWithToken }
