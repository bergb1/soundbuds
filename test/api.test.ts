import app from '../src/app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import randomstring from 'randomstring';
import { getNotFound } from './testFunctions';
import { UserTest } from '../src/interfaces/User';
import { loginUser, registerUser } from './userFunctions';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';

describe('Testing graphql api', () => {
    beforeAll(async () => {
        // Configure the environment
        dotenv.config();

        // Start a database connection before testing
        await mongoose.connect(process.env.DATABASE_URL as string);
    });

    // Close the database connection afterwards
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test not found
    it('should responds with a not found message', async () => {
        await getNotFound(app);
    });

    const testUser: UserTest = {
        username: 'Test User ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@user.fi',
        password: 'testpassword',
    };

    let rootuserData: LoginMessageResponse;
    let testUserData: LoginMessageResponse;

    // Test register
    it('should register a user', async () => {
        await registerUser(app, testUser);
    });

    // Root login
    it('should login the root', async () => {
        rootuserData = await loginUser(app, {
            username: 'root',
            email: process.env.ROOT_EMAIL as string,
            password: process.env.ROOT_PWD as string
        });
    });

    // User login
    it('should login a user', async () => {
        testUserData = await loginUser(app, testUser);
    });
});
