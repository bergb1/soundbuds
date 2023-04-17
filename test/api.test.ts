import app from '../src/app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import randomstring from 'randomstring';
import { getNotFound } from './testFunctions';
import { UserTest } from '../src/interfaces/User';
import { registerUser } from './userFunctions';

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
        user_name: 'Test User ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@user.fi',
        password: 'testpassword',
    };

    // test register
    it('should register a user', async () => {
        await registerUser(app, testUser);
    });
});
