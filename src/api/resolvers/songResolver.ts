import { GraphQLError } from 'graphql';
import { Song } from "../../interfaces/Song";
import { User, UserIdWithToken } from "../../interfaces/User";
import songModel from "../models/songModel";
import { Types } from 'mongoose';

export default {
    User: {
        favorite_song: async (parent: User) => {
            return await songModel.findById(parent.favorite_song);
        }
    },
    Query: {
        songs: async () => {
            return await songModel
                .find()
                .select('-__v');
        },
        songGet: async (
            _parent: undefined,
            args: {
                _id: string
            }
        ) => {

        },
        songSearch: async (
            _parent: undefined,
            args: {
                name: string
            }
        ) => {

        }
    },
    Mutation: {
        songCreate: async (
            _parent: undefined,
            args: {
                song: Song
            },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Check privileges
            if (user.role != 'creator') {
                throw new GraphQLError('not a creator');
            }

            // Add properties
            args.song.creator = new Types.ObjectId(user._id);

            // Execute the request
            const song = await songModel.create(args.song);

            // Validate the response
            if (!song) {
                throw new GraphQLError('song not created');
            } else {
                return song;
            }
        },
        songUpdate: async (
            _parent: undefined,
            args: {
                _id: string,
                song: Song
            },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Find the instance            
            const target_song = await songModel.findById(args._id);
            if (!target_song) {
                throw new GraphQLError('song not found');
            }

            // Check privileges
            if (['admin', 'root'].indexOf(user.role) === -1 && !target_song.creator._id.equals(user._id)) {
                throw new GraphQLError('request not authorized');
            }

            // Execute the request
            const song = await songModel.findByIdAndUpdate(args._id, args.song, { new: true });

            // Validate the response
            if (!song) {
                throw new GraphQLError('song not updated');
            }

            return song;
        },
        songDelete: async (
            _parent: undefined,
            args: {
                _id: string
            },
            user: UserIdWithToken
        ) => {
                
        }
    }
}
