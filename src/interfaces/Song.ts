import { Document, Types } from "mongoose";

// Regular Song interface
interface Song {
    song_name: string;
    cover: string;
    description: string;
    creator: Types.ObjectId;
    album?: Types.ObjectId;
}

// Song interface with optional fields for testing
interface SongTest extends Partial<Song> {}

// Song for database interactions
interface SongDatabase extends Song, Document {}

export { Song, SongTest, SongDatabase }
