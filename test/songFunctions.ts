import request from 'supertest';
import UploadMessageResponse from '../src/interfaces/UploadMessageResponse';

const coverUpload = (
    url: string | Function,
    path: string
): Promise<UploadMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/api/upload')
            .attach('cover', 'test/' + path)
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const resp = response.body;
                    console.log(resp);
                    expect(resp).toHaveProperty('message');
                    expect(resp).toHaveProperty('data');
                    expect(resp.data).toHaveProperty('filename');
                    resolve(resp);
                }
            });
    });
};

export { coverUpload }