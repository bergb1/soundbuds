import { GraphQLError } from 'graphql';
import { Post } from "../../interfaces/Post"
import { UserIdWithToken } from "../../interfaces/User"
import postModel from "../models/postModel"
import { Types } from 'mongoose';

export default {
    Query: {
        postsUser: async (
            _parent: undefined,
            args: {
                _id: string
            }
        ) => {

        },
        postsFollowing: async (
            _parent: undefined,
            _args: undefined,
            user: UserIdWithToken
        ) => {

        }
    },
    Mutation: {
        postCreate: async (
            _parent: undefined,
            args: {
                post: Post
            },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Add the user as the creator
            args.post.creator = new Types.ObjectId(user._id);

            // Execute the request
            const post = await postModel.create(args.post);

            // Validate the response
            if (!post) {
                throw new GraphQLError('post not created');
            }

            return post;
        },
        postDelete: async (
            _parent: undefined,
            args: {
                _id: string
            },
            user: UserIdWithToken
        ) => {

        }
    }
}

// Behaviour when a parent user was deleted
const postUserDelete = async (user_id: string) => {
    await postModel.deleteMany({ creator: user_id });
}

// Behaviour when a parent song was deleted
const postSongDelete = async (song_id: string) => {
    await postModel.deleteMany({ song: song_id });
}

export { postUserDelete, postSongDelete }
