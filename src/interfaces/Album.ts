import { Document, Types } from "mongoose";

// Regular Album interface
interface Album {
    name: string;
    cover: string;
    description: string;
    creator: Types.ObjectId;
}

// Song interface with optional fields for testing
interface AlbumTest extends Partial<Album> {}

// Song for database interactions
interface AlbumDatabase extends Album, Document {}

export { Album, AlbumTest, AlbumDatabase }
