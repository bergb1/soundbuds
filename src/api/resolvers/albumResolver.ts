import { GraphQLError } from 'graphql';
import { Album } from "../../interfaces/Album";
import { Song } from "../../interfaces/Song";
import { User, UserIdWithToken } from "../../interfaces/User";
import albumModel from "../models/albumModel";
import { Types } from 'mongoose';
import { userAlbumDelete } from './userResolver';
import { songAlbumDelete, songAlbumUpdate } from './songResolver';

export default {
    User: {
        favorite_album: async (parent: User) => {
            return await albumModel.findById(parent.favorite_album);
        }
    },
    Song: {
        album: async (parent: Song) => {
            return await albumModel.findById(parent.album);
        }
    },
    Query: {
        albumSearch: async (
            _parent: undefined,
            args: {
                name: string
            }
        ) => {
            return await albumModel
                .find({ name: { $regex: `(?i)(\w*(${args.name})\w*)` } })
                .select('-__v');
        }
    },
    Mutation: {
        albumCreate: async (
            _parent: undefined,
            args: {
                album: Album
            },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Check privileges
            if (['creator', 'admin', 'root'].indexOf(user.role) === -1) {
                throw new GraphQLError('not a creator');
            }

            // Add the user as the creator
            args.album.creator = new Types.ObjectId(user._id);

            // Execute the request
            const album = await albumModel.create(args.album);

            // Validate the response
            if (!album) {
                throw new GraphQLError('album not created');
            } 

            return album;
        },
        albumUpdate: async (
            _parent: undefined,
            args: {
                _id: string,
                album: Album
            },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Find the instance            
            const target_album = await albumModel.findById(args._id);
            if (!target_album) {
                throw new GraphQLError('album not found');
            }

            // Check privileges
            if (['admin', 'root'].indexOf(user.role) === -1 && !target_album.creator.equals(user._id)) {
                throw new GraphQLError('request not authorized');
            }

            // Execute the request
            const album = await albumModel.findByIdAndUpdate(args._id, args.album, { new: true });

            // Validate the response
            if (!album) {
                throw new GraphQLError('album not updated');
            }
            
            // If the cover was changed, change song covers aswell
            if (args.album.cover) {
                await songAlbumUpdate(album);
            }
            
            return album;
        },
        albumDelete: async (
            _parent: undefined,
            args: {
                _id: string
            },
            user: UserIdWithToken
        ) => {
            if (!user.token) {
                throw new GraphQLError('not logged in');
            }

            // Find the instance            
            const target_album = await albumModel.findById(args._id);
            if (!target_album) {
                throw new GraphQLError('album not found');
            }

            // Check privileges
            if (['admin', 'root'].indexOf(user.role) === -1 && !target_album.creator._id.equals(user._id)) {
                throw new GraphQLError('request not authorized');
            }

            // Execute the request
            const resp = await albumModel.findByIdAndDelete(args._id);

            // Validate the response
            if (!resp) {
                throw new GraphQLError('album not deleted');
            }

            // Delete dependencies for the deleted instance
            await deleteDependencies(args._id);
            
            return true;
        }
    }
}

const deleteDependencies = async (album_id: string) => {
    // Handle optional dependencies
    await userAlbumDelete(album_id);
    await songAlbumDelete(album_id);
}

// Behaviour when a user was deleted
const albumUserDelete = async (
    user_id: string
) => {
    // Manage own dependencies
    const albums = await albumModel.find({ creator: user_id });
    for (let i = 0; i < albums.length; i++) {
        await deleteDependencies(albums[i]._id.valueOf());
    }

    await albumModel.deleteMany({ creator: user_id });
}

export { albumUserDelete }


