import { GraphQLError } from 'graphql';
import { UserIdWithToken } from "../../interfaces/User";
import followerModel from "../models/followerModel";
import { Types } from 'mongoose';

export default {
    Query: {
        followers: async (
            _parent: unknown,
            _args: unknown,
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Execute the request
            const followers = await followerModel
                .find( { target: user._id } )
                .select('-__v -_id');

            return followers.map(rel => rel.user);
        },
        following: async (
            _parent: unknown,
            _args: unknown,
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Execute the request
            const following = await followerModel
                .find( { user: user._id } )
                .select('-__v -_id');

            return following.map(rel => rel.target._id);
        },
        followMutuals: async (
            _parent: unknown,
            _args: unknown,
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Make a list of the IDs of mutuals
            const mutuals: Types.ObjectId[] = [];
            const following = await followerModel.find( { user: user._id } );
            const followers = await followerModel.find( { target: user._id } );

            // Find all mutuals
            for (let i = 0; i < following.length; i++) {
                for (let j = 0; j < followers.length; j++) {
                    if (following[i].target._id.equals(followers[j].user)) {
                        mutuals.push(followers.splice(j, 1)[0].user);
                        break;
                    }
                }
            };

            // Return the mutual followers
            return mutuals;
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
            if (!deleted) {
                throw new GraphQLError('user not unfollowed');
            }

            return deleted
        }
    }
};
