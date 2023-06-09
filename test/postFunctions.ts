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
                    expect(resp.song?._id).toBe(args.post.song?.valueOf());
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

// Get all posts from a user
const postGetForUser = (
    url: string | Function,
    args: { _id: string }
): Promise<PostTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query: 
                    `query Query($id: ID!) {
                        postsUser(creator: $id) {
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
                    const resp = response.body.data.postsUser as PostTest[];
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

// Get all posts test
const postGetFollowing = (
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
                        postsFollowing {
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
                    const resp = response.body.data.postsFollowing as PostTest[];
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

export { postCreate, postDelete, postGetForUser, postGetFollowing }
