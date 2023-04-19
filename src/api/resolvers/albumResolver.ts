import albumModel from "../models/albumModel";

export default {
    Query: {
        albums: async () => {
            return await albumModel
                .find()
                .select('-__v');
        }
    }
}
