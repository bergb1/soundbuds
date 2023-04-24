import request from 'supertest';
import UploadMessageResponse from '../src/interfaces/UploadMessageResponse';
import { Song, SongTest } from '../src/interfaces/Song';

// Upload cover test
const coverUpload = (
    url: string | Function,
    token: string,
    args: { path: string }
): Promise<UploadMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/api/upload')
            .set('Authorization', 'Bearer ' + token)
            .attach('cover', 'test/' + args.path)
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body;
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('data');
                    expect(resp.data).toHaveProperty('filename');
                    resolve(resp);
                }
            });
    });
}

// Create song test
const songCreate = (
    url: string | Function,
    token: string,
    args: { song: SongTest }
): Promise<SongTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation SongCreate($song: SongInput!) {
                        songCreate(song: $song) {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
                                nickname
                            }
                            album {
                                _id
                                name
                            }
                        }
                    }`,
                variables: {
                    song: args.song
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.SongCreate as SongTest;
                    expect(resp._id).toBeDefined();
                    expect(resp.name).toBe(args.song.name);
                    expect(resp.cover).toBe(args.song.cover);
                    expect(resp.description).toBe(args.song.description);
                    expect(resp.creator).toBeDefined();
                    expect(resp.album).toBe(args.song.album);
                    resolve(resp);
                }
            });
    });
}

// Update song test
const songUpdate = (
    url: string | Function,
    token: string,
    args: { song: SongTest }
): Promise<SongTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: 
                    `mutation SongUpdate($id: ID!, $song: SongUpdate!) {
                        songUpdate(_id: $id, song: $song) {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
                                nickname
                            }
                            album {
                                _id
                                name
                            }
                        }
                    }`,
                variables: {
                    song: args.song
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.SongUpdate as SongTest;
                    expect(resp._id).toBe(args.song._id);
                    expect(resp.name).toBe(args.song.name);
                    expect(resp.cover).toBe(args.song.cover);
                    expect(resp.description).toBe(args.song.description);
                    expect(resp.creator).toBe(args.song.creator);
                    expect(resp.album).toBe(args.song.album);
                    resolve(resp);
                }
            });
    });
}

// Delete song test
const songDelete = (
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
                    `mutation SongDelete($id: ID!) {
                        songDelete(_id: $id)
                    }`,
                variables: {
                    id: args._id
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.SongDelete as boolean;
                    expect(resp).toBeDefined();
                    expect(resp).toBe(true);
                    resolve(resp);
                }
            });
    });
}

// Get all songs test
const songGetAll = (
    url: string | Function,
): Promise<SongTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query:
                    `query Query {
                        songs {
                            _id
                            name
                            cover
                            description
                            creator {
                                _id
                                username
                                nickname
                            }
                            album {
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
                    const resp = response.body.data.SongDelete as SongTest[];
                    expect(resp).toBeInstanceOf(Array);
                    expect(resp.length).toBeGreaterThan(0);
                    expect(resp[0]).toBeDefined();
                    expect(resp[0]._id).toBeDefined();
                    expect(resp[0].name).toBeDefined();
                    expect(resp[0].cover).toBeDefined();
                    expect(resp[0].creator).toBeDefined();
                    resolve(resp);
                }
            });
    });
}

// Get song test
const songGet = (
    url: string | Function,
    args: { _id: string }
): Promise<SongTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query:
                    ``,
                variables: {

                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    // resolve
                }
            });
    });
}

// Search for songs test
const songSearch = (
    url: string | Function,
    args: { name: string }
): Promise<SongTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query:
                    ``,
                variables: {

                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    // resolve
                }
            });
    });
}

export { coverUpload, songCreate, songUpdate, songDelete, songGetAll, songGet, songSearch }