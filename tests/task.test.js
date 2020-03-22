const request = require('supertest');
const app = require('../app');

test('Should fetch user data', async () => {
    await request(app).get('/post/fetch').send({}).expect(200);
});