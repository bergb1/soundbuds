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
                    ``,
                variables: {
                    // Variables
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
                    ``,
                variables: {
                    // Variables
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
                    ``,
                variables: {
                    // Variables
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

// Get all albums test
const albumGetAll = (
    url: string | Function,
): Promise<AlbumTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .send({
                query: 
                    ``,
                variables: {
                    // Variables
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
                    ``,
                variables: {
                    // Variables
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
                    ``,
                variables: {
                    // Variables
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

export { albumCreate, albumUpdate, albumDelete, albumGetAll, albumGet, albumSearch }