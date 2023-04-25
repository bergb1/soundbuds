import request from 'supertest';
import { Album, AlbumTest } from '../src/interfaces/Album';

// Create album test
const albumCreate = (
    url: string | Function,
    token: string,
    args: { album: AlbumTest }
): Promise<AlbumTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation AlbumCreate($album: AlbumInput!) {
                        albumCreate(album: $album) {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
                            }
                        }
                    }`,
                variables: {
                    album: args.album
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.albumCreate as AlbumTest;
                    expect(resp._id).toBeDefined();
                    expect(resp.name).toBe(args.album.name);
                    expect(resp.cover).toBe(args.album.cover);
                    expect(resp.creator).toBeDefined();
                    resolve(resp);
                }
            });
    });
}

// Update album test
const albumUpdate = (
    url: string | Function,
    token: string,
    args: { _id: string, album: AlbumTest }
): Promise<AlbumTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation AlbumUpdate($id: ID!, $album: AlbumUpdate!) {
                        albumUpdate(_id: $id, album: $album) {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
                            }
                        }
                    }`,
                variables: {
                    id: args._id,
                    album: args.album
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.albumUpdate as AlbumTest;
                    expect(resp._id).toBeDefined();
                    if (args.album.name) expect(resp.name).toBe(args.album.name);
                    if (args.album.description) expect(resp.description).toBe(args.album.description);
                    if (args.album.cover) expect(resp.cover).toBe(args.album.cover);
                    resolve(resp);
                }
            });
    });
}

// Delete album test
const albumDelete = (
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
                    `mutation AlbumDelete($id: ID!) {
                        albumDelete(_id: $id)
                    }`,
                variables: {
                    id: args._id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.albumDelete as boolean;
                    expect(resp).toBe(true);
                    resolve(resp);
                }
            });
    });
}

// Get all albums test
const albumGetAll = (
    url: string | Function,
): Promise<AlbumTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query: 
                    `query Query {
                        albums {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
                            }
                        }
                    }`
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.albums as AlbumTest[];
                    expect(resp.length).toBeGreaterThan(0);
                    expect(resp[0]._id).toBeDefined();
                    expect(resp[0].name).toBeDefined();
                    expect(resp[0].cover).toBeDefined();
                    expect(resp[0].creator?._id).toBeDefined();
                    resolve(resp);
                }
            });
    });
}

// Get album test
const albumGet = (
    url: string | Function,
    args: { _id: string }
): Promise<AlbumTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query: 
                    `query Query($id: ID!) {
                        ablum(_id: $id) {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
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
                    const resp = response.body.data.album as AlbumTest;
                    expect(resp._id).toBeDefined();
                    expect(resp.name).toBeDefined();
                    expect(resp.cover).toBeDefined();
                    expect(resp.creator?._id).toBeDefined();
                    resolve(resp);
                }
            });
    });
}

// Search for albums test
const albumSearch = (
    url: string | Function,
    args: { name: string }
): Promise<AlbumTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query:
                    `query Query($name: String!) {
                        albumSearch(name: $name) {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
                            }
                        }
                    }`,
                variables: {
                    name: args.name
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.albumSearch as AlbumTest[];
                    expect(resp.length).toBeGreaterThan(0);
                    expect(resp[0]._id).toBeDefined();
                    expect(resp[0].name).toBeDefined();
                    expect(resp[0].cover).toBeDefined();
                    expect(resp[0].creator?._id).toBeDefined();
                    resolve(resp);
                }
            });
    });
}

export { albumCreate, albumUpdate, albumDelete, albumGetAll, albumGet, albumSearch }