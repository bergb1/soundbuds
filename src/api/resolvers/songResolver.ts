import { GraphQLError } from 'graphql';
import { Song } from "../../interfaces/Song";
import { User, UserIdWithToken } from "../../interfaces/User";
import songModel from "../models/songModel";
import { Types } from 'mongoose';
import albumModel from '../models/albumModel';
import { userSongDelete } from './userResolver';
import { postSongDelete } from './postResolver';
import { Post } from '../../interfaces/Post';
import { AlbumDatabase } from '../../interfaces/Album';

export default {
    User: {
        favorite_song: async (parent: User) => {
            return await songModel.findById(parent.favorite_song);
        }
    },
    Post: {
        song: async (parent: Post) => {
            return await songModel.findById(parent.song);
        }
    },
    Query: {
        songsUser: async (
            _parent: unknown,
            args: {
                creator: string;
            }
        ) => {
            return await songModel
                .find({ creator: args.creator })
                .select('-__v');
        },
        songSearch: async (
            _parent: undefined,
            args: {
                name: string
            }
        ) => {
            return await songModel
                .find({ name: { $regex: `(?i)(\w*(${args.name})\w*)` } })
                .select('-__v');
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
            if (['creator', 'admin', 'root'].indexOf(user.role) === -1) {
                throw new GraphQLError('not a creator');
            }

            // Add the user as the creator
            args.song.creator = new Types.ObjectId(user._id);
            
            // Make the album cover the song cover if it was provided
            if (args.song.album) {
                const album = await albumModel.findById(args.song.album);
                if (!album) {
                    throw new GraphQLError('album not found');
                } else if (!album.creator.equals(user._id)) {
                    throw new GraphQLError('request not authorized');
                } else {
                    args.song.cover = album.cover;
                }
            }

            // Execute the request
            const song = await songModel.create(args.song);

            // Validate the response
            if (!song) {
                throw new GraphQLError('song not created');
            }

            return song;
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
            if (['admin', 'root'].indexOf(user.role) === -1 && !target_song.creator.equals(user._id)) {
                throw new GraphQLError('request not authorized');
            }

            // Remove the cover if the song is in an album
            if (target_song.album && !args.song.album && args.song.cover) {
                args.song.cover = target_song.cover;
            }

            // Pass album properties
            if (args.song.album) {
                const album = await albumModel.findById(args.song.album);
                if (!album) {
                    throw new GraphQLError('album not found');
                } else if (!album.creator.equals(user._id)) {
                    throw new GraphQLError('request not authorized');
                } else {
                    args.song.cover = album.cover;
                }
            }

            // Execute the request
            const song = await songModel.findByIdAndUpdate(args._id, args.song, { new: true });

            // Validate the response
            if (!song) {
                throw new GraphQLError('song not updated');
            }

            return song
        },
        songDelete: async (
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
            const target_song = await songModel.findById(args._id);
            if (!target_song) {
                throw new GraphQLError('song not found');
            }

            // Check privileges
            if (['admin', 'root'].indexOf(user.role) === -1 && !target_song.creator.equals(user._id)) {
                throw new GraphQLError('request not authorized');
            }

            // Execute the request
            const resp = await songModel.findByIdAndDelete(args._id);

            // Validate the response
            if (!resp) {
                throw new GraphQLError('song not deleted');
            }

            // Delete dependencies for the deleted instance
            await deleteDependencies(args._id);

            return true;
        }
    }
}

// Behaviour when a song was deleted
const deleteDependencies = async (song_id: string) => {
    await postSongDelete(song_id);
    await userSongDelete(song_id);
}

// Behaviour when a user was deleted
const songUserDelete = async (user_id: string) => {
    // Manage own dependencies
    const songs = await songModel.find({ creator: user_id });
    for (let i = 0; i < songs.length; i++) {
        await deleteDependencies(songs[i]._id.valueOf());
    }

    await songModel.deleteMany({ creator: user_id });
}

// Behaviour when an album was updated
const songAlbumUpdate = async (album: AlbumDatabase) => {
    await songModel.updateMany({ album: album._id }, { cover: album.cover });
}

// Behaviour when an album was deleted
const songAlbumDelete = async (album_id: string) => {
    await songModel.updateMany({ album: album_id }, { $unset: { album: "" } });
}

export { songUserDelete, songAlbumUpdate, songAlbumDelete }
