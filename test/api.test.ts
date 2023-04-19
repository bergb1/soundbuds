import app from '../src/app';
import randomstring from 'randomstring';
import { getNotFound } from './testFunctions';
import { UserTest } from '../src/interfaces/User';
import { elevateUser, loginUser, registerUser, failElevateUser, updateNickname, updateUsernameByID, failUpdateUsernameByID, userDelete } from './userFunctions';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import userModel from '../src/api/models/userModel';

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
        testUser._id = (await registerUser(app, testUser)).user._id;
    });

    // Creator register
    it('should register a user', async () => {
        testCreator._id = (await registerUser(app, testCreator)).user._id;
    });

    // Admin register
    it('should register a user', async () => {
        testAdmin._id = (await registerUser(app, testAdmin)).user._id;
        let actualUser = await userModel.findById(testAdmin._id);
        if(actualUser?.role == 'admin') {
            throw new Error('User was created with admin role');
        }
    });

    // Root login
    it(`should login the root`, async () => {
        rootUserData = await loginUser(app, {
            username: 'root',
            email: process.env.ROOT_EMAIL as string,
            password: process.env.ROOT_PWD as string
        });
    });

    // User login
    it('should login a user', async () => {
        testUserData = await loginUser(app, testUser);
    });

    // Test escalation with wrong priviledge
    it(`should't elevate the user to an admin`, async () => {
        await failElevateUser(app, testAdmin._id!, 'admin', testUserData.token!);
    });

    // Assign the admin role to the admin
    it('should elevate a user to an admin', async () => {
        await elevateUser(app, testAdmin._id!, 'admin', rootUserData.token!);
        let actualUser = await userModel.findById(testAdmin._id);
        if(actualUser?.role != 'admin') {
            throw new Error('User was not elevated');
        }
    });

    // Admin login
    it('should login a user', async () => {
        testAdminData = await loginUser(app, testAdmin);
    });

    // Assign the creator role to creator
    it('should elevate a user to a creator', async () => {
        await elevateUser(app, testCreator._id!, 'creator', testAdminData.token!);
        let actualUser = await userModel.findById(testCreator._id);
        if(actualUser?.role != 'creator') {
            throw new Error('User was not elevated');
        }
    });

    // Test update user
    it(`should update a user's nickname`, async () => {
        await updateNickname(app, 'Test User', testUserData.token!);
    });

    // Test admin update user
    it(`should update a creator's username as an admin`, async () => {
        testCreator.username = (await updateUsernameByID(app, testCreator._id!, testAdminData.token!)).user.username;
    });

    // Test update by ID auth
    it(`shouldn't update the creator's username as a user`, async () => {
        await failUpdateUsernameByID(app, testCreator._id!, testUserData.token!);
    });

    // Creator login
    it('should login a creator', async () => {
        testCreatorData = await loginUser(app, testCreator);
    });

    // User delete
    it(`Should delete the user`, async () => {
        await userDelete(app, testUserData.token!);
    });
});
