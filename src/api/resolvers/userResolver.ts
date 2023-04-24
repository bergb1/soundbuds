import { GraphQLError } from 'graphql';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import { User, UserIdWithToken } from '../../interfaces/User';
import Credentials from '../../interfaces/Credentials';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { salt } from '../..';
import { Song } from '../../interfaces/Song';
import { Album } from '../../interfaces/Album';
import { Follower } from '../../interfaces/Follower';
import followerModel from '../models/followerModel';
import songModel from '../models/songModel';
import albumModel from '../models/albumModel';

// Function to check if user one may modify user two
const mayModify = async (user_role: string, target_id: string, role?: string) => {
    // Permission check
    const authorized = ['admin', 'root'];
    const userAuth = authorized.indexOf(user_role);
    if (userAuth === -1) {
        return false;
    }

    // Fetch the target user
    const target = await userModel.findById(target_id);
    if(!target) {
        throw new GraphQLError('user not found');
    }

    // Compare the auth
    if (userAuth <= authorized.indexOf(target.role)) {
        return false;
    } else if (role && userAuth <= authorized.indexOf(role)) {
        return false;
    } else {
        return true;
    }
}

export default {
    Song: {
        creator: async (parent: Song) => {
            return await userModel.findById(parent.creator);
        }
    },
    Album: {
        creator: async (parent: Album) => {
            return await userModel.findById(parent.creator);
        }
    },
    Query: {
        users: async () => {
            return await userModel
                .find()
                .select('-__v -password -role');
        },
        user: async (
            _parent: unknown,
            args: {_id: string}
        ) => {
            return await userModel
                .findById(args._id)
                .select('-__v -password -role');
        },
        userSearch: async (
            _parent: unknown,
            args: {username: string}
        ) => {
            return await userModel
                .find({ username: { $regex: `(?i)(\w*(${args.username})\w*)` } })
                .select('-__v -password -role');
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
        userUpdate: async (
            _parent: unknown,
            args: { user: User },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Hash password changes
            if (args.user.password) {
                args.user.password = await bcrypt.hash(args.user.password, salt);
            }

            // Execute the request
            const updatedUser = await userModel.findByIdAndUpdate(user._id, args.user, { new: true });

            // Validate the response
            if (!updatedUser) {
                throw new GraphQLError('user not updated');
            }

            // Manage the response
            const message: LoginMessageResponse = {
                message: 'user updated',
                user: updatedUser
            };
            return message;
        },
        userUpdateByID: async (
            _parent: unknown,
            args: { _id: string, user: User },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Compare the auth
            if (!(await mayModify(user.role, args._id))) {
                throw new GraphQLError('request not authorized');
            }

            // Hash password changes
            if (args.user.password) {
                args.user.password = await bcrypt.hash(args.user.password, salt);
            }

            // Execute the request
            const updatedUser = await userModel.findByIdAndUpdate(args._id, args.user, { new: true });

            // Validate the response
            if (!updatedUser) {
                throw new GraphQLError('user not updated');
            }

            // Manage the response
            const message: LoginMessageResponse = {
                message: 'user updated',
                user: updatedUser
            };
            return message;
        },
        userChangeRole: async (
            _parent: unknown,
            args: { _id: string, role: string },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Compare the auth
            if (!(await mayModify(user.role, args._id, args.role))) {
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
        userDelete: async (
            _parent: unknown,
            _args: unknown,
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Execute the request
            const deletedUser = await userModel.findByIdAndDelete(user._id);

            // Validate the response
            if (!deletedUser) {
                throw new GraphQLError('user not deleted');
            }

            // Remove follower relations
            await followerModel.deleteMany( { user: user._id } );
            await followerModel.deleteMany( { target: user._id } );

            // Manage the response
            const message: LoginMessageResponse = {
                message: 'user deleted',
                user: deletedUser
            };
            return message;
        },
        userDeleteByID: async (
            _parent: unknown,
            args: {_id: string},
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Compare the auth
            if (!(await mayModify(user.role, args._id))) {
                throw new GraphQLError('request not authorized');
            }

            // Execute the request
            const deletedUser = await userModel.findByIdAndDelete(args._id);

            // Validate the response
            if (!deletedUser) {
                throw new GraphQLError('user not deleted');
            }

            // Remove follower relations
            await followerModel.deleteMany( { user: args._id } );
            await followerModel.deleteMany( { target: args._id } );

            // Manage the response
            const message: LoginMessageResponse = {
                message: 'user deleted',
                user: deletedUser
            };
            return message;
        }
    }
};
