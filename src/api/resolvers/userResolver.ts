import { GraphQLError } from 'graphql';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import { User } from '../../interfaces/User';
import Credentials from '../../interfaces/Credentials';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        },
        login: async (
            _parent: unknown,
            args: {credentials: Credentials}
        ) => {
            // Check if the user exists
            const user = await userModel.findOne({username: args.credentials.username});
            if (!user) {
                throw new GraphQLError('Username/Password incorrect');
            }

            // Check if the password matches
            if (!bcrypt.compareSync(args.credentials.password, user.password)) {
                throw new GraphQLError('Username/Password incorrect');
            }

            // Make a token
            const token = jwt.sign(
                {_id: user._id, role: user.role},
                process.env.JWT_SECRET as string
            );

            // Manage the response
            const message: LoginMessageResponse = {
                message: 'Login successful',
                token: token,
                user: user
            };
            return message;
        }
    }
};
