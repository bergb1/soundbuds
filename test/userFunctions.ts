import request from 'supertest';
import expect from 'expect';
import {UserTest} from '../src/interfaces/User';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import randomstring from 'randomstring';

import dotenv from 'dotenv';
dotenv.config();

// Should register a user
const userRegister = (
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
const userLogin = (
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
                    expect(resp.user.username).toBe(user.username);
                    resolve(resp);
                }
            });
    });
};

const userElevate = (
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
                    `mutation userChangeRole($_id: ID!, $role: String!) {
                        userChangeRole(_id: $_id, role: $role) {
                            message
                            user {
                                _id
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
                    const resp = response.body.data.userChangeRole;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user).toHaveProperty('_id');
                    expect(resp.user).not.toHaveProperty('password');
                    expect(resp.user).not.toHaveProperty('role');
                    resolve(resp);
                }
            });
    });
}

const userUpdate = (
    url: string | Function,
    token: string
): Promise<LoginMessageResponse> => {
    const nickname = 'Nickname Tester';
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
                    expect(resp.user).toHaveProperty('_id');
                    expect(resp.user).not.toHaveProperty('password');
                    expect(resp.user).not.toHaveProperty('role');
                    expect(resp.user.nickname).toBe(nickname);
                    resolve(resp);
                }
            });
    });
}

const userUpdateByID = (
    url: string | Function,
    _id: string, token: string
): Promise<LoginMessageResponse> => {
    let username = 'Test Person ' + randomstring.generate(7);
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation userUpdateByID($_id: ID!, $user: AdminModify!) {
                        userUpdateByID(_id: $_id, user: $user) {
                            message
                            token
                            user {
                                _id
                                username
                            }
                        }
                    }`
                , variables: {
                    _id: _id,
                    user: {
                        username: username
                    }
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.userUpdateByID;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('token');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user).toHaveProperty('_id');
                    expect(resp.user).not.toHaveProperty('password');
                    expect(resp.user).not.toHaveProperty('role');
                    expect(resp.user.username).toBe(username);
                    resolve(resp);
                }
            });
    });
}

const userDelete = (
    url: string | Function, 
    token: string
): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation userDelete {
                        userDelete {
                            message
                            token
                            user {
                                _id
                            }
                        }
                    }`
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.userDelete;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('token');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user).toHaveProperty('_id');
                    resolve(resp);
                }
            });
    });
}

const userDeleteByID = (
    url: string | Function, 
    _id: string, token: string
): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation userDeleteByID($_id: ID!) {
                        userDeleteByID(_id: $_id) {
                            message
                            token
                            user {
                                _id
                            }
                        }
                    }`
                , variables: {
                    _id: _id,
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.userDeleteByID;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('token');
                    expect(resp).toHaveProperty('user');
                    expect(resp.user).toHaveProperty('_id');
                    resolve(resp);
                }
            });
    });
}

// Get All test
const getUsers = (url: string | Function): Promise<UserTest[]> => {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/graphql')
        .set('Content-type', 'application/json')
        .send({
            query: 
                `query users {
                    users{
                        _id
                        username
                        email
                        nickname
                        profile_color
                        favorite_song {
                            _id
                        }
                        favorite_album {
                            _id
                        }
                    }
                }`,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.users;
                    expect(resp).toBeInstanceOf(Array);
                    expect(resp[0]).toHaveProperty('_id');
                    expect(resp[0]).toHaveProperty('username');
                    expect(resp[0]).toHaveProperty('email');
                    expect(resp[0]).toHaveProperty('profile_color');
                    expect(resp[0]).not.toHaveProperty('password');
                    expect(resp[0]).not.toHaveProperty('role');
                    resolve(resp);
                }
            });
    });
};

// Get Single test
const getSingleUser = (
    url: string | Function,
    _id: string
): Promise<UserTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .send({
                query: 
                    `query user($_id: ID!) {
                        user(_id: $_id) {
                            _id
                            username
                            email
                            nickname
                            profile_color
                            favorite_song {
                                _id
                            }
                            favorite_album {
                                _id
                            }
                        }
                    }`,
                variables: {
                    _id: _id
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.user;
                    expect(resp._id).toBe(_id);
                    expect(resp).toHaveProperty('username');
                    expect(resp).toHaveProperty('email');
                    expect(resp).toHaveProperty('profile_color');
                    expect(resp).not.toHaveProperty('password');
                    expect(resp).not.toHaveProperty('role');
                    resolve(resp);
                }
            });
    });
};

// Get by matching usernames test
const getUserByName = (
    url: string | Function,
    username: string
): Promise<UserTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .send({
                query: 
                    `query usersByName($username: String!) {
                        usersByName(username: $username) {
                            _id
                            username
                            email
                            nickname
                            profile_color
                            favorite_song {
                                _id
                            }
                            favorite_album {
                                _id
                            }
                        }
                    }`,
                variables: {
                    username: username
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.usersByName;
                    expect(resp[0]).toHaveProperty('_id');
                    expect(resp[0]).toHaveProperty('username');
                    expect(resp[0]).toHaveProperty('email');
                    expect(resp[0]).toHaveProperty('profile_color');
                    expect(resp[0]).not.toHaveProperty('password');
                    expect(resp[0]).not.toHaveProperty('role');
                    resolve(resp);
                }
            });
    });
};

export { userRegister, userLogin, userElevate, userUpdate, userUpdateByID, userDelete, userDeleteByID, getUsers, getSingleUser, getUserByName }
