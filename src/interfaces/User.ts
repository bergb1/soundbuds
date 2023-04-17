import { Document } from "mongoose";

interface User {
    user_name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    nick_name?: string;
    profile_color?: string;
}

interface UserOutput extends Omit<User, 'role' | 'password'>, Document {}

interface UserDatabase extends User, Document {}

interface UserTest extends Partial<UserDatabase> {};

interface UserIdWithToken {
    _id: string;
    token: string;
    role: 'admin' | 'user';
}

export { User, UserOutput, UserDatabase, UserTest, UserIdWithToken }
