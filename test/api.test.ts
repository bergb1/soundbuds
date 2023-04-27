import app from '../src/app';
import randomstring from 'randomstring';
import { getNotFound } from './testFunctions';
import { UserTest } from '../src/interfaces/User';
import { getSingleUser, getUserByName, userDelete, userDeleteByID, userElevate, userLogin, userRegister, userUpdate, userUpdateByID } from './userFunctions';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import userModel from '../src/api/models/userModel';
import { followMutuals, followUser, followerRelationsRemoved, followers, following, unfollowUser } from './followFunctions';
import { coverUpload, songCreate, songDelete, songSearch, songUpdate } from './songFunctions';
import { SongTest } from '../src/interfaces/Song';
import { albumCreate, albumDelete, albumSearch, albumUpdate } from './albumFunctions';
import { AlbumTest } from '../src/interfaces/Album';
import { Types } from 'mongoose';
import { postCreate, postDelete, postGetFollowing, postGetForUser } from './postFunctions';

describe('Testing graphql api', () => {
    // Test not found
    it('should responds with a not found message', async () => {
        await getNotFound(app);
    });

    // Regular user for testing
    let testUser: UserTest = {
        username: 'Test User ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@user.fi',
        password: 'testpassword'
    };

    // User register
    it('should register a user', async () => {
        testUser._id = (await userRegister(app, testUser)).user._id;
    });

    // Creator for testing
    let testCreator: UserTest = {
        username: 'Test Creator ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@creator.fi',
        password: 'testpassword'
    };

    // Creator register
    it('should register a user', async () => {
        testCreator._id = (await userRegister(app, testCreator)).user._id;
    });

    // Admin register
    it('should register a user', async () => {
        testAdmin._id = (await userRegister(app, testAdmin)).user._id;
        let actualUser = await userModel.findById(testAdmin._id);
        if(actualUser?.role == 'admin') {
            throw new Error('User was created with admin role');
        }
    });

    // Admin user for testing with illegal self-assigned role
    let testAdmin: UserTest = {
        username: 'Test Admin ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@admin.fi',
        password: 'testpassword',
        role: 'admin'
    };

    // Get Single test
    it(`should get the admin user`, async () => {
        await getSingleUser(app, testAdmin._id!);
    });

    // Get by matching usernames test
    it(`should get the 'Test Creater' user by searching cre`, async () => {
        await getUserByName(app, 'cre');
    });

    // Root login
    let rootUserData: LoginMessageResponse;
    it(`should login the root`, async () => {
        rootUserData = await userLogin(app, {
            username: 'root',
            email: process.env.ROOT_EMAIL as string,
            password: process.env.ROOT_PWD as string
        });
    });

    // User login
    let testUserData: LoginMessageResponse;
    it('should login a user', async () => {
        testUserData = await userLogin(app, testUser);
    });

    // Assign the admin role to the admin
    it('should elevate a user to an admin', async () => {
        await userElevate(app, testAdmin._id!, 'admin', rootUserData.token!);
        let actualUser = await userModel.findById(testAdmin._id);
        if(actualUser?.role != 'admin') {
            throw new Error('User was not elevated');
        }
    });

    // Admin login
    let testAdminData: LoginMessageResponse;
    it('should login a user', async () => {
        testAdminData = await userLogin(app, testAdmin);
    });

    // Assign the creator role to creator
    it('should elevate a user to a creator', async () => {
        await userElevate(app, testCreator._id!, 'creator', testAdminData.token!);
        let actualUser = await userModel.findById(testCreator._id);
        if(actualUser?.role != 'creator') {
            throw new Error('User was not elevated');
        }
    });

    // Test update user
    it(`should update a user's nickname`, async () => {
        await userUpdate(app, testUserData.token!);
    });

    // Test admin update user
    it(`should update a creator's username as an admin`, async () => {
        testCreator.username = (await userUpdateByID(app, testCreator._id!, testAdminData.token!)).user.username;
    });

    // Creator login
    let testCreatorData: LoginMessageResponse;
    it('should login a creator', async () => {
        testCreatorData = await userLogin(app, testCreator);
    });

    // Upload song cover test
    let songCover: string;
    it('should upload a cover image for a song', async () => {
        songCover = (await coverUpload(app, testCreatorData.token!, {
            path: 'cover1.jpg'
        })).data.filename;
    });

    // Create song test
    let testSong1: SongTest;
    it('should create a song', async () => {
        testSong1 = await songCreate(app, testCreatorData.token!, {
            song: {
                name: 'Heavy Metal',
                cover: songCover
            }
        });
    });

    // Update song test
    it(`should update a song`, async () => {
        testSong1.description = 'Heavy metal music for heavy metal fans.';
        testSong1 = await songUpdate(app, testCreatorData.token!, {
            _id: testSong1._id!,
            song: testSong1
        });
    });

    // Song mutation as admin test
    it(`should update a song as an admin`, async () => {
        testSong1.name = 'Death Metal';
        testSong1 = await songUpdate(app, testAdminData.token!, {
            _id: testSong1._id!,
            song: testSong1
        });
    });

    // Search for song test
    it(`should find all songs with an 'e' in it`, async () => {
        await songSearch(app, {
            name: 'e'
        });
    });

    // Create album
    let testAlbum: AlbumTest;
    it(`should create an album`, async () => {
        testAlbum = await albumCreate(app, testCreatorData.token!, {
            album: {
                name: 'Techno',
                cover: songCover
            }
        });
    });

    // Create song
    it(`should create a song in an album`, async () => {
        await songCreate(app, testCreatorData.token!, {
            song: {
                name: 'Techno Hit #1',
                album: new Types.ObjectId(testAlbum._id)
            }
        });
    });

    // Upload album cover test
    it('should upload a cover image for an album', async () => {
        songCover = (await coverUpload(app, testCreatorData.token!, {
            path: 'cover2.jpg'
        })).data.filename;
    });

    // Update album
    it(`should modify the cover of the album`, async () => {
        testAlbum.cover = songCover;
        testAlbum = await albumUpdate(app, testCreatorData.token!, {
            _id: testAlbum._id!,
            album: testAlbum
        });
    });

    // Search for albums
    it(`should search all albums with an 'e' in the name`, async () => {
        await albumSearch(app, {
            name: 'e'
        });
    });

    // Delete albums
    it(`should delete the album`, async () => {
        await albumDelete(app, testCreatorData.token!, {
            _id: testAlbum._id!
        });
    });

    // Follow test
    it('should follow the creator as a user', async () => {
        await followUser(app, testCreator._id!, testUserData.token!);
    });

    // Follow test
    it('should follow the creator as the admin', async () => {
        await followUser(app, testCreator._id!, testAdminData.token!);
    });

    // Follow test
    it('should follow the admin as the creator', async () => {
        await followUser(app, testAdmin._id!, testCreatorData.token!);
    });

    // Followers get test
    it(`should find followers for the creator`, async () => {
        await followers(app, testCreatorData.token!);
    });

    // Following get test
    it(`should find users the creator is following`, async () => {
        await following(app, testCreatorData.token!);
    });

    // Mutual follower test
    it(`should find one mutual follower`, async () => {
        await followMutuals(app, testCreatorData.token!);
    });

    // Unfollow test
    it('should unfollow the creator as the user', async () => {
        await unfollowUser(app, testCreator._id!, testUserData.token!);
    });

    // Create Post
    let testPostID: string;
    it(`should create a post`, async () => {
        testPostID = (await postCreate(app, testAdminData.token!, {
            post: {
                message: 'Hello world!',
                song: new Types.ObjectId(testSong1._id)
            }
        }))._id!;
    });

    // Get all user posts
    it(`should return all posts made by a user`, async () => {
        await postGetForUser(app, {
            _id: testAdmin._id!
        });
    });

    /* Get all following posts
    it(`should return all posts from people you are following`, async () => {
        await postGetFollowing(app, testCreatorData.token!);
    });

    // Delete post
    it(`should delete a post`, async () => {
        await postDelete(app, testAdminData.token!, {
            _id: testPostID
        });
    });
    */

    // Should delete a song
    it(`should delete a song`, async () => {
        await songDelete(app, testCreatorData.token!, {
            _id: testSong1._id!
        });
    });

    // User delete
    it(`should delete the user`, async () => {
        await userDelete(app, testUserData.token!);
    });

    // User delete by ID
    it(`should delete the admin as the root`, async () => {
        await userDeleteByID(app, testAdmin._id!, rootUserData.token!);
    });

    // User delete by ID
    it(`should delete the creator as an admin`, async () => {
        await userDeleteByID(app, testCreator._id!, testAdminData.token!);
    });

    // Dependencies test
    it(`should find no follower relationships with deleted dependencies`, async () => {
        await followerRelationsRemoved(app, testCreatorData.token!);
    });
});
