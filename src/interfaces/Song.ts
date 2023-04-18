import { Document, Types } from "mongoose";

// Regular Song interface
interface Song {
    song_name: string;
    cover: string;
    genre: string;
    user_id: Types.ObjectId;
    album_id?: Types.ObjectId;
}

// Song interface with optional fields for testing
interface SongTest extends Partial<Song> {}

// Song for database interactions
interface SongDatabase extends Song, Document {}

export { Song, SongTest, SongDatabase }
