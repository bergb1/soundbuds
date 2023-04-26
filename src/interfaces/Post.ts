import { Document, Types } from "mongoose";

// Regular Song interface
interface Post {
    message: string;
    date: Date;
    creator: Types.ObjectId;
    song: Types.ObjectId;
}

// Song interface with optional fields for testing
interface PostTest extends Partial<Post> {
    _id?: string
}

// Song for database interactions
interface PostDatabase extends Post, Document {}

export { Post, PostTest, PostDatabase }
