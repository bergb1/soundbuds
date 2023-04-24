import request from 'supertest';
import UploadMessageResponse from '../src/interfaces/UploadMessageResponse';
import { Song, SongTest } from '../src/interfaces/Song';

// Upload cover test
const coverUpload = (
    url: string | Function,
    token: string,
    args: {path: string}
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
    args: {song: SongTest}
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
                    }`
                , variables: {
                    song: args.song
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body.data.SongCreate;
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
    token: string
): Promise<SongTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
    });
}

// Delete song test
const songDelete = (
    url: string | Function,
    token: string
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
    });
}

// Get all songs test
const songGetAll = (
    url: string | Function,
): Promise<SongTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
    });
}

// Get song test
const songGet = (
    url: string | Function,
): Promise<SongTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
    });
}

// Search for songs test
const songSearch = (
    url: string | Function,
): Promise<SongTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
    });
}

export { coverUpload, songCreate, songUpdate, songDelete, songGetAll, songGet, songSearch }