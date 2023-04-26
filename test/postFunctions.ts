import request from "supertest";
import { PostTest } from "../src/interfaces/Post";

// Create post test
const postCreate = (
    url: string | Function,
    token: string,
    args: { post: PostTest }
): Promise<PostTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation Mutation($post: PostInput!) {
                        postCreate(post: $post) {
                            _id
                            message
                            date
                            creator {
                                _id
                                username
                            }
                            song {
                                _id
                                name
                            }
                        }
                    }`,
                variables: {
                    post: args.post
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.postCreate as PostTest;
                    expect(resp._id).toBeDefined();
                    expect(resp.message).toBe(args.post.message);
                    expect(resp.date).toBeDefined();
                    expect(resp.creator?._id).toBeDefined();
                    expect(resp.song?._id).toBe(args.post.song);
                    resolve(resp);
                }
            });
    });
}

// Update post test
const postUpdate = (
    url: string | Function,
    token: string,
    args: { _id: string, post: PostTest }
): Promise<PostTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation Mutation($id: ID!, $post: PostUpdate!) {
                        postUpdate(_id: $id, post: $post) {
                            _id
                            message
                            date
                            creator {
                                _id
                                username
                            }
                            song {
                                _id
                                name
                            }
                        }
                    }`,
                variables: {
                    id: args._id,
                    post: args.post
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.postUpdate as PostTest;
                    expect(resp._id).toBe(args._id);
                    if (args.post.message) expect(resp.message).toBe(args.post.message);
                    expect(resp.date).toBeDefined();
                    expect(resp.creator?._id).toBeDefined();
                    if (args.post.song) expect(resp.song?._id).toBe(args.post.song);
                    resolve(resp);
                }
            });
    });
}

// Delete post test
const postDelete = (
    url: string | Function,
    token: string,
    args: { _id: string }
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation Mutation($id: ID!) {
                        postDelete(_id: $id)
                    }`,
                variables: {
                    id: args._id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.postDelete as boolean;
                    expect(resp).toBe(true);
                    resolve(resp);
                }
            });
    });
}

// Get all posts test
const postGetAll = (
    url: string | Function,
    token: string
): Promise<PostTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `query Query {
                        posts {
                            _id
                            message
                            date
                            creator {
                                _id
                                username
                            }
                            song {
                                _id
                                name
                            }
                        }
                    }`
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.posts as PostTest[];
                    expect(resp.length).toBeGreaterThan(0);
                    expect(resp[0]._id).toBeDefined();
                    expect(resp[0].message).toBeDefined();
                    expect(resp[0].date).toBeDefined();
                    expect(resp[0].creator?._id).toBeDefined();
                    expect(resp[0].song?._id).toBeDefined();
                    resolve(resp);
                }
            });
    });
}

// Get single post test
const postGet = (
    url: string | Function,
    token: string,
    args: { _id: string }
): Promise<PostTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `query Query($id: ID!) {
                        post(_id: $id) {
                            _id
                            message
                            date
                            creator {
                                _id
                                username
                            }
                            song {
                                _id
                                name
                            }
                        }
                    }`,
                variables: {
                    id: args._id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.post as PostTest;
                    expect(resp._id).toBe(args._id);
                    expect(resp.message).toBeDefined();
                    expect(resp.date).toBeDefined();
                    expect(resp.creator?._id).toBeDefined();
                    expect(resp.song?._id).toBeDefined();
                    resolve(resp);
                }
            });
    });
}

export { postCreate, postUpdate, postDelete, postGetAll, postGet }
