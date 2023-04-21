import app from '../src/app';
import randomstring from 'randomstring';
import { getNotFound } from './testFunctions';
import { UserTest } from '../src/interfaces/User';
import { getSingleUser, getUserByName, getUsers, userDelete, userDeleteByID, userElevate, userLogin, userRegister, userUpdate, userUpdateByID } from './userFunctions';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import userModel from '../src/api/models/userModel';
import { followMutuals, followUser, followerRelationsRemoved, followers, following, unfollowUser } from './followFunctions';
import { coverUpload } from './songFunctions';

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

    let testUserData: LoginMessageResponse;

    // Creator for testing
    let testCreator: UserTest = {
        username: 'Test Creator ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@creator.fi',
        password: 'testpassword'
    };

    let testCreatorData: LoginMessageResponse;

    // Admin user for testing with illegal self-assigned role
    let testAdmin: UserTest = {
        username: 'Test Admin ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@admin.fi',
        password: 'testpassword',
        role: 'admin'
    };

    let testAdminData: LoginMessageResponse;

    // Root user
    let rootUserData: LoginMessageResponse;

    // User register
    it('should register a user', async () => {
        testUser._id = (await userRegister(app, testUser)).user._id;
    });

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

    // Get All test
    it(`should retrieve an array of all the users in the database`, async () => {
        await getUsers(app);
    });

    // Get Single test
    it(`should get the admin user`, async () => {
        await getSingleUser(app, testAdmin._id!);
    });

    // Get by matching usernames test
    it(`should get the 'Test Creater' user by searching cre`, async () => {
        await getUserByName(app, 'cre');
    });

    // Root login
    it(`should login the root`, async () => {
        rootUserData = await userLogin(app, {
            username: 'root',
            email: process.env.ROOT_EMAIL as string,
            password: process.env.ROOT_PWD as string
        });
    });

    // User login
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
    it('should login a creator', async () => {
        testCreatorData = await userLogin(app, testCreator);
    });

    // Upload song cover test
    it('should upload a cover image for a song or album', async () => {
        await coverUpload(app, 'cover1.jpg');
    });

    // Create song test
    it('should create a song', async () => {

    });

    // Upload album cover test
    it('should upload a cover image for a song or album', async () => {
        await coverUpload(app, 'cover2.jpg');
    });

    // Create album test
    it('should create an album', async () => {

    });

    // Create song with album test
    it('should create a song by using the cover of an album', async () => {

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

    // User delete
    it(`Should delete the user`, async () => {
        await userDelete(app, testUserData.token!);
    });

    // User delete by ID
    it(`Should delete the admin as the root`, async () => {
        await userDeleteByID(app, testAdmin._id!, rootUserData.token!);
    });

    // Dependencies test
    it(`should find no followers for the creator's ID`, async () => {
        await followerRelationsRemoved(app, testCreatorData.token!);
    })

    // User delete by ID
    it(`Should delete the creator as an admin`, async () => {
        await userDeleteByID(app, testCreator._id!, testAdminData.token!);
    });
});
