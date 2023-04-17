import request from 'supertest';
import expect from 'expect';
import {UserTest} from '../src/interfaces/User';
import randomstring from 'randomstring';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';

// Should register a user
const registerUser = (
    url: string | Function,
    user: UserTest
): Promise<UserTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .send({
                query: 
                    `mutation Mutation($user: UserInput!) {
                        register(user: $user) {
                            message
                            user {
                                id
                                user_name
                                email
                                nick_name
                                profile_color
                            }
                        }
                    }`
                , variables: {
                    user: {
                        user_name: user.user_name,
                        email: user.email,
                        password: user.password,
                    },
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const userData = response.body.data.register;
                    expect(userData).toHaveProperty('message');
                    expect(userData).toHaveProperty('user');
                    expect(userData.user).toHaveProperty('id');
                    expect(userData.user.user_name).toBe(user.user_name);
                    expect(userData.user.email).toBe(user.email);
                    expect(userData.user).not.toHaveProperty('password');
                    expect(userData.user).not.toHaveProperty('role');
                    expect(userData.user.profile_color).toBe('cyan');
                    resolve(response.body.data.register);
                }
            });
    });
};

export { registerUser }
