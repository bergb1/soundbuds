import { Document, Types } from "mongoose";

// Regular Song interface
interface Song {
    name: string;
    cover: string;
    description: string;
    creator: Types.ObjectId;
    album?: Types.ObjectId;
}

// Song interface with optional fields for testing
interface SongTest extends Partial<Song> {
    _id?: string
}

// Song for database interactions
interface SongDatabase extends Song, Document {}

export { Song, SongTest, SongDatabase }
