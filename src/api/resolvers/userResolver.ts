import { GraphQLError } from 'graphql';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import { User, UserIdWithToken } from '../../interfaces/User';
import Credentials from '../../interfaces/Credentials';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(12);

export default {
    Query: {
        users: async () => {
            return await userModel
                .find()
                .select('-__v');
        }
    },
    Mutation: {
        register: async (
            _parent: unknown,
            args: {user: User}
        ) => {
            // Encrypt the password
            args.user.password = await bcrypt.hash(args.user.password, salt);

            // Execute the request
            const newUser = await userModel.create(args.user);

            // Validate the response
            if (!newUser) {
                throw new GraphQLError('User not created');
            }

            // Manage the response
            const resp: LoginMessageResponse = {
                message: 'user created',
                user: newUser
            }
            return resp;
        }
    }
};
