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
