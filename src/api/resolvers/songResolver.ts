import { User } from "../../interfaces/User";
import songModel from "../models/songModel";

export default {
    User: {
        favorite_song: async (parent: User) => {
            return await songModel.findById(parent.favorite_song);
        }
    },
    Query: {
        songs: async () => {
            return await songModel
                .find()
                .select('-__v');
        }
    }
}
