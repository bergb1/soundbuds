import { Document, Types } from "mongoose";

interface User {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    nickname?: string;
    profile_color?: string;
    song_id?: Types.ObjectId;
    album_id?: Types.ObjectId;
}

interface UserOutput extends Omit<User, 'role' | 'password'>, Document {}

interface UserDatabase extends User, Document {}

interface UserTest extends Partial<UserDatabase> {};

interface UserIdWithToken {
    id: string;
    token: string;
    role: 'admin' | 'user';
}

export { User, UserOutput, UserDatabase, UserTest, UserIdWithToken }
