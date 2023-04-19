import request from 'supertest';
import expect from 'expect';
import {UserTest} from '../src/interfaces/User';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';

import dotenv from 'dotenv';
dotenv.config();

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
                    expect(resp.user).not.toHaveProperty('password');
                    expect(resp.user).not.toHaveProperty('role');
                    expect(resp.user.username).toBe(user.username);
                    expect(resp.user.email).toBe(user.email);
                    expect(resp.user.profile_color).toBe('cyan');
                    resolve(resp);
                }
            });
    });
};

// Should login a user
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
                    expect(resp.user).not.toHaveProperty('role');
                    expect(resp.user.email).toBe(user.email);
                    resolve(resp);
                }
            });
    });
};

const elevateUser = (
    url: string | Function,
    _id: string, role: string, token: string
): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation elevatePriviledges($_id: ID!, $role: String!) {
                        elevatePriviledges(_id: $_id, role: $role) {
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
                    role: role,
                    _id: _id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.elevatePriviledges;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('token');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user).toHaveProperty('_id');
                    expect(resp.user).not.toHaveProperty('password');
                    expect(resp.user).not.toHaveProperty('role');
                    resolve(resp);
                }
            });
    });
}

const failElevateUser = (
    url: string | Function,
    _id: string, role: string, token: string
): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation elevatePriviledges($_id: ID!, $role: String!) {
                        elevatePriviledges(_id: $_id, role: $role) {
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
                    role: role,
                    _id: _id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.elevatePriviledges;
                    if(!resp) {
                        resolve(resp);
                    } else {
                        reject(resp);
                    }
                }
            });
    });
}

const updateNickname = (
    url: string | Function,
    nickname: string, token: string
): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation userUpdate($user: UserModify!) {
                        userUpdate(user: $user) {
                            message
                            token
                            user {
                                _id
                                username
                                email
                                nickname
                            }
                        }
                    }`
                , variables: {
                    user: {
                        nickname: nickname
                    }
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.userUpdate;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('token');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user.nickname).toBe(nickname);
                    resolve(resp);
                }
            });
    });
}

export { registerUser, loginUser, elevateUser, failElevateUser, updateNickname }
