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
                                _id
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
                    const resp = response.body.data.register;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user).toHaveProperty('_id');
                    expect(resp.user.username).toBe(user.username);
                    expect(resp.user.email).toBe(user.email);
                    expect(resp.user).not.toHaveProperty('password');
                    expect(resp.user).not.toHaveProperty('role');
                    expect(resp.user.profile_color).toBe('cyan');
                    resolve(resp);
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
                                _id
                                username
                                email
                                nickname
                                profile_color
                            }
                        }
                    }`
                , variables: {
                    credentials: {
                        username: user.username,
                        password: user.password
                    }
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.login;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('token');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user).toHaveProperty('_id');
                    expect(resp.user).not.toHaveProperty('password');
                    expect(resp.user.email).toBe(user.email);
                    resolve(resp);
                }
            });
    });
};

export { registerUser, loginUser }
