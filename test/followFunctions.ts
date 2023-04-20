import request from 'supertest';

const followUser = (
    url: string | Function,
    target_id: string, token: string
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                `
                    mutation FollowAdd($targetId: ID!) {
                        followAdd(target_id: $targetId) {
                            user
                            target
                        }
                    }
                `
                , variables: {
                    targetId: target_id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp: { user: string, target: string } = response.body.data.followAdd;
                    expect(resp).toBeDefined;
                    expect(resp.user).toBeDefined();
                    expect(resp.target).toBe(target_id);
                    resolve(true);
                }
            });
    });
}

const unfollowUser = (
    url: string | Function,
    target_id: string, token: string
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query:
                `
                    mutation FollowRemove($targetId: ID!) {
                        followRemove(target_id: $targetId) {
                            acknowledged
                            deletedCount
                        }
                    }
                `
                , variables: {
                    targetId: target_id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp: { acknowledged: boolean, deletedCount: number } = response.body.data.followRemove;
                    expect(resp).toBeDefined;
                    expect(resp.acknowledged).toBe(true);
                    expect(resp.deletedCount).toBeGreaterThan(0);
                    resolve(true);
                }
            });
    });
}

const followers = (
    url: string | Function,
    token: string
): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query:
                `
                    query Query {
                        followers
                    }
                `
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp: string[] = response.body.data.followers;
                    expect(resp).toBeDefined();
                    expect(resp).toBeInstanceOf(Array);
                    resolve(resp);
                }
            });
    });
}

const following = (
    url: string | Function,
    token: string
) => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query:
                `
                    query Query {
                        following
                    }
                `
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp: string[] = response.body.data.following;
                    expect(resp).toBeDefined();
                    expect(resp).toBeInstanceOf(Array);
                    resolve(resp);
                }
            });
    });
}

const followMutuals = (
    url: string | Function,
    token: string
) => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query:
                `
                    query Query {
                        followMutuals
                    }
                `
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp: string[] = response.body.data.followMutuals;
                    expect(resp).toBeDefined();
                    expect(resp).toBeInstanceOf(Array);
                    expect(resp.length).toBe(1);
                    resolve(resp);
                }
            });
    });
}

const followerRelationsRemoved = (
    url: string | Function,
    token: string
) => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query:
                `
                    query Query {
                        followers
                    }
                `
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp: string[] = response.body.data.followers;
                    console.log(resp);
                    expect(resp).toBeDefined();
                    expect(resp).toBeInstanceOf(Array);
                    expect(resp.length).toBe(0);
                    resolve(resp);
                }
            });
    });
}

const template = (
    url: string | Function,
    token: string
) => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query:
                `
                
                `
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    // Acceptance Criteria
                }
            });
    });
}

export { followUser, unfollowUser, followers, following, followMutuals, followerRelationsRemoved };