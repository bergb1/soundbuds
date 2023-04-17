import { GraphQLError } from 'graphql';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import { User, UserIdWithToken } from '../../interfaces/User';
import Credentials from '../../interfaces/Credentials';
import userModel from '../models/userModel';

export default {
    Query: {
        users: async () => {
            return await userModel
                .find()
                .select('-__v');
        }
    }
};
