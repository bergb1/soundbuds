import app from '../src/app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import randomstring from 'randomstring';
import { getNotFound } from './testFunctions';
import { UserTest } from '../src/interfaces/User';
import { loginUser, registerUser } from './userFunctions';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';

describe('Testing graphql api', () => {
    // Test not found
    it('should responds with a not found message', async () => {
        await getNotFound(app);
    });

    // Root login information
    let rootuserData: LoginMessageResponse;

    // Root login
    it('should login the root', async () => {
        rootuserData = await loginUser(app, {
            username: 'root',
            email: process.env.ROOT_EMAIL as string,
            password: process.env.ROOT_PWD as string
        });
    });

    // Regular user for testing
    const testUser1: UserTest = {
        username: 'Test User ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@user.fi',
        password: 'testpassword',
    };

    // User register
    it('should register a user', async () => {
        await registerUser(app, testUser1);
    });

    // Regular user login information
    let testUser1Data: LoginMessageResponse;

    // User login
    it('should login a user', async () => {
        testUser1Data = await loginUser(app, testUser1);
    });
});
