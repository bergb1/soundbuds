import { Document, Types } from "mongoose";

// Regular User interface
interface User {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'creator' | 'user';
    nickname?: string;
    profile_color: string;
    song_id?: Types.ObjectId;
    album_id?: Types.ObjectId;
}

// User interface with optional fields for testing
interface UserTest extends Partial<User> {};

// User for database interactions
interface UserDatabase extends User, Document {};

// Input User for registering
interface UserRegister {
    username: string;
    email: string;
    password: string;
}

// Output interface for Users
interface UserIdWithToken {
    _id: string;
    token: string;
    role: 'admin' | 'creator' | 'user';
}

export { User, UserRegister, UserDatabase, UserTest, UserIdWithToken }
