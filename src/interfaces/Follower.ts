import { Types } from "mongoose";

interface Follower {
    user: Types.ObjectId;
    target: Types.ObjectId;
};

// User for database interactions
interface FollowerDatabase extends Follower, Document {};

export { Follower, FollowerDatabase };
