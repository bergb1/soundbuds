import app from '../src/app';
import randomstring from 'randomstring';
import { getNotFound } from './testFunctions';
import { UserTest } from '../src/interfaces/User';
import { elevateUser, loginUser, registerUser, failElevateUser } from './userFunctions';
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

    // User register
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

    // Test escalation with wrong priviledge
    it(`shouldn't elevate the root to a user`, async () => {
        await failElevateUser(app, rootUserData.user._id, 'user', testAdminData.token!);
    });
});
