import { Song } from "../../interfaces/Song";
import { User } from "../../interfaces/User";
import albumModel from "../models/albumModel";

export default {
    User: {
        favorite_album: async (parent: User) => {
            return await albumModel.findById(parent.favorite_album);
        }
    },
    Song: {
        album: async (parent: Song) => {
            return await albumModel.findById(parent.album);
        }
    },
    Query: {
        albums: async () => {
            return await albumModel
                .find()
                .select('-__v');
        }
    }
}
