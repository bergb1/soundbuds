import { GraphQLError } from 'graphql';
import { Post, PostDatabase } from "../../interfaces/Post"
import { UserIdWithToken } from "../../interfaces/User"
import postModel from "../models/postModel"
import { Types } from 'mongoose';
import followerModel from '../models/followerModel';

const comparePosts = (a: PostDatabase, b: PostDatabase) => {
    if (a.date < b.date) return -1;
    else if (a.date > b.date) return 1;
    else return 0;
}

export default {
    Query: {
        postsUser: async (
            _parent: undefined,
            args: {
                creator: string
            }
        ) => {
            return await postModel
                .find({ creator: args.creator })
                .select('-__v');
        },
        postsFollowing: async (
            _parent: undefined,
            _args: undefined,
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Get all the people the user is following
            const following = await followerModel
                .find( { user: user._id } )
                .select('-__v -_id');

            // Get all the posts from people the user is following
            let resp: PostDatabase[] = [];
            for (let i = 0; i < following.length; i++) {
                // Get all posts by the followed user
                const posts = await postModel
                    .find({ creator: following[i].target });
                
                // Add the posts to the response
                posts.forEach(post => {
                    resp.push(post);
                });
            }

            // Validate the response
            if (!resp) {
                throw new GraphQLError('posts not found');
            }
            
            // Sort the posts on dates
            resp?.sort(comparePosts);

            return resp;
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
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Find the instance            
            const target_post = await postModel.findById(args._id);
            if (!target_post) {
                throw new GraphQLError('post not found');
            }

            // Check privileges
            if (['admin', 'root'].indexOf(user.role) === -1 && !target_post.creator.equals(user._id)) {
                throw new GraphQLError('request not authorized');
            }

            // Execute the request
            const resp = await postModel.findByIdAndDelete(args._id);

            // Validate the response
            if (!resp) {
                throw new GraphQLError('post not deleted');
            }

            return true
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
