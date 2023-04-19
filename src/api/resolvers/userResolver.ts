import { GraphQLError } from 'graphql';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import { User, UserDatabase, UserIdWithToken } from '../../interfaces/User';
import Credentials from '../../interfaces/Credentials';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { salt } from '../..';

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

            // Generate a token
            const token = jwt.sign({
                    _id: user._id, 
                    role: user.role 
                }, process.env.JWT_SECRET as string
            );

            // Manage the response
            const message: LoginMessageResponse = {
                message: 'Login successful',
                token: token,
                user: user
            };
            return message;
        },
        elevatePriviledges: async (
            _parent: unknown,
            args: { _id: string, role: string },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Permission check
            const authorized = ['admin', 'root'];
            const userAuth = authorized.indexOf(user.role);
            if (userAuth === -1) {
                throw new GraphQLError('request not authorized');
            }

            // Fetch the target user
            const target = await userModel.findById(args._id);
            if(!target) {
                throw new GraphQLError('user not found');
            }
            let targetAuth = authorized.indexOf(target.role);

            // Check the role auth level
            const roleAuth = authorized.indexOf(args.role);

            // Compare the auth
            if (userAuth <= targetAuth || userAuth <= roleAuth) {
                throw new GraphQLError('request not authorized');
            }

            // Execute the request
            const updatedUser = await userModel.findByIdAndUpdate(args._id, args, { new: true });

            // Validate the response
            if (!updatedUser) {
                throw new GraphQLError('user not updated');
            }

            // Manage the response
            const message: LoginMessageResponse = {
                message: 'user role changed',
                user: updatedUser
            };
            return message;
        },
        userUpdate: async (
            _parent: unknown,
            args: { user: User },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            
        }
    }
};
