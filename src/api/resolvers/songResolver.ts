import songModel from "../models/songModel";

export default {
    Query: {
        songs: async () => {
            return await songModel
                .find()
                .select('-__v');
        }
    }
}
