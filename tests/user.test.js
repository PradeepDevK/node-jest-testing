const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

beforeEach(async () => {
    console.log('beforeEach');
    //await User.deleteMany();
});

test('Should fetch user data', async () => {
    await request(app).get('/user/fetch').send({}).expect(200);
});

test('Should add user data', async () => {
    await request(app).post('/user/add').send({
        "name": "luke",
        "email": "luke@example.com",
        "password": ""
    }).expect(200);

    //Assert that the user was added correctly
    //let userModel = new User(null);
    //const user = await userModel.fetchUserDetails();
    //expect(user).not.toBeNull();

    //Assertion about response
    // expect(response).toMatchObject({
    // })
    
    //expect(response.body.users.name).toBe('luke');
});