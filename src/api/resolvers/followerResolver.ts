import { GraphQLError } from 'graphql';
import { UserIdWithToken } from "../../interfaces/User";
import followerModel from "../models/followerModel";
import { Types } from 'mongoose';
import userModel from '../models/userModel';

export default {
    Query: {
        followers: async (
            _parent: unknown,
            args: {_id: string}
        ) => {
            // Execute the request
            const followers = await followerModel
                .find( { target: args._id } )
                .select('-__v -_id');

            return followers.map(rel => rel.user);
        },
        following: async (
            _parent: unknown,
            args: {_id: string}
        ) => {
            // Execute the request
            const following = await followerModel
                .find( { user: args._id } )
                .select('-__v -_id');

            return following.map(rel => rel.target);
        }
    },
    Mutation: {
        followAdd: async (
            _parent: unknown,
            args: { target_id: string },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Make sure the user isn't already following the other person
            const following = await followerModel.findOne( { user: user._id, target: args.target_id } );
            if (following) {
                throw new GraphQLError('already following');
            }

            // Check if dependancies still exist
            let dep = await userModel.findById(user._id);
            if (!dep) {
                throw new Error('user not found');
            }
            dep = await userModel.findById(args.target_id);
            if (!dep) {
                throw new Error('target not found');
            }

            // Execute the request
            const relation =  await followerModel.create( { user: user._id, target: args.target_id } );

            // Validate the response
            if (!relation) {
                throw new GraphQLError('user not followed');
            }

            return relation
        },
        followRemove: async (
            _parent: unknown,
            args: { target_id: string },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Execute the request
            const deleted = await followerModel.deleteOne( { user: user._id, target: args.target_id } );

            // Validate the response
            if (!deleted.acknowledged) {
                throw new GraphQLError('user not unfollowed');
            }

            return deleted
        }
    }
};

// Behaviour when a user was deleted
const followerUserDelete = async (user_id: string) => {
    await followerModel.deleteMany({ user: user_id });
    await followerModel.deleteMany({ target: user_id });
}

export { followerUserDelete }
