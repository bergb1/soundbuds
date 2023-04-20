import { GraphQLError } from 'graphql';
import { UserIdWithToken } from "../../interfaces/User";
import followerModel from "../models/followerModel";

export default {
    Query: {
        followers: async (
            _parent: unknown,
            args: { user_id: string }
        ) => {
            return await followerModel
                .find( { target: args.user_id } )
                .select('-__v -_id');
        },
        following: async (
            _parent: unknown,
            args: { user_id: string }
        ) => {
            return await followerModel
                .find( { user: args.user_id } )
                .select('-__v -_id');
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

            return await followerModel.create( { user: user._id, target: args.target_id } );
        }
    }
};
