import mongoose from "mongoose";
import { FollowerDatabase } from "../../interfaces/Follower";

const follwerModel = new mongoose.Schema<FollowerDatabase>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model<FollowerDatabase>('Follower', follwerModel);
