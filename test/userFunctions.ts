import request from 'supertest';
import expect from 'expect';
import {UserTest} from '../src/interfaces/User';
import randomstring from 'randomstring';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';

// Should register a user
const registerUser = (
    url: string | Function,
    user: UserTest
): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .send({
                query: 
                    `mutation register($user: UserInput!) {
                        register(user: $user) {
                            message
                            user {
                                id
                                username
                                email
                                nickname
                                profile_color
                            }
                        }
                    }`
                , variables: {
                    user: {
                        username: user.username,
                        email: user.email,
                        password: user.password
                    }
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const userData = response.body.data.register;
                    expect(userData).toHaveProperty('message');
                    expect(userData).toHaveProperty('user');
                    expect(userData.user).toHaveProperty('id');
                    expect(userData.user.username).toBe(user.username);
                    expect(userData.user.email).toBe(user.email);
                    expect(userData.user).not.toHaveProperty('password');
                    expect(userData.user).not.toHaveProperty('role');
                    expect(userData.user.profile_color).toBe('cyan');
                    resolve(response.body.data.register);
                }
            });
    });
};

// Should register a user
const loginUser = (
    url: string | Function,
    user: UserTest
): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .send({
                query: 
                    `mutation login($credentials: Credentials!) {
                        login(credentials: $credentials) {
                            message
                            token
                            user {
                                id
                                username
                                email
                                nickname
                                profile_color
                            }
                        }
                    }`
                , variables: {
                    credentials: {
                        email: user.email,
                        password: user.password
                    }
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const userData = response.body.data.login;
                    expect(userData).toHaveProperty('message');
                    expect(userData).toHaveProperty('token');
                    expect(userData).toHaveProperty('user');
                    expect(userData.user).toHaveProperty('id');
                    expect(userData.user).not.toHaveProperty('password');
                    expect(userData.user.email).toBe(user.email);
                    resolve(response.body.data.login);
                }
            });
    });
};

export { registerUser, loginUser }
