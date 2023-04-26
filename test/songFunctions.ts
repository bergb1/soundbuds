import request from 'supertest';
import UploadMessageResponse from '../src/interfaces/UploadMessageResponse';
import { SongTest } from '../src/interfaces/Song';

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
                    const resp = response.body.data.songCreate as SongTest;
                    expect(resp._id).toBeDefined();
                    expect(resp.name).toBe(args.song.name);
                    expect(resp.creator?._id).toBeDefined();
                    if (args.song.cover && !args.song.album) {
                        expect(resp.cover).toBe(args.song.cover);
                    } else if (args.song.album) {
                        expect(resp.cover).toBeDefined();
                        expect(resp.album?._id).toBe(args.song.album.valueOf());
                    }
                    resolve(resp);
                }
            });
    });
}

// Update song test
const songUpdate = (
    url: string | Function,
    token: string,
    args: { _id: string, song: SongTest }
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
                            }
                            album {
                                _id
                                name
                            }
                        }
                    }`,
                variables: {
                    id: args._id,
                    song: {
                        name: args.song.name,
                        cover: args.song.cover,
                        description: args.song.description,
                        album: args.song.album
                    }
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.songUpdate as SongTest;
                    expect(resp._id).toBe(args._id);
                    expect(resp.name).toBe(args.song.name);
                    expect(resp.cover).toBe(args.song.cover);
                    expect(resp.creator?._id).toBeDefined();
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
                    const resp = response.body.data.songDelete as boolean;
                    expect(resp).toBeDefined();
                    expect(resp).toBe(true);
                    resolve(resp);
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
                    `query Query($name: String!) {
                        songSearch(name: $name) {
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
                    name: args.name
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.songSearch as SongTest[];
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

export { coverUpload, songCreate, songUpdate, songDelete, songSearch }