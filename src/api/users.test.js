import request from 'supertest';
import express from 'express';

import { usersRouter } from './users.js';

const app = express();

app.use(express.json());
app.use('/users', usersRouter);

const testUserData = {
    login: 'test login',
    password: '123abc',
    age: 20
};

jest.mock('./auth.js', () => ({
    checkToken: jest.fn().mockImplementation((req, res, next) => {
        next();
    })
}));
jest.mock('../config.js', () => ({
    configureServices: jest.fn().mockImplementation(() => ({
        usersService: {
            add: jest.fn().mockImplementation(() => testUserData),
            find: jest.fn().mockImplementation(() => testUserData),
            update: jest.fn().mockImplementation(() => testUserData),
            remove: jest.fn(),
            getSuggested: jest.fn().mockImplementation(() => [testUserData])
        }
    }))
}));

describe('Users route', () => {
    test('add', (done) => {
        const expectedResponse = {
            login: testUserData.login,
            age: testUserData.age
        };
        request(app)
            .post('/users')
            .send(testUserData)
            .expect('Content-Type', /json/)
            .expect(expectedResponse)
            .expect(200, done);
    });

    test('get', (done) => {
        const expectedResponse = {
            login: testUserData.login,
            age: testUserData.age
        };
        request(app)
            .get('/users/1')
            .expect('Content-Type', /json/)
            .expect(expectedResponse)
            .expect(200, done);
    });

    test('update', (done) => {
        const expectedResponse = {
            login: testUserData.login,
            age: testUserData.age
        };
        request(app)
            .patch('/users/1')
            .send(testUserData)
            .expect('Content-Type', /json/)
            .expect(expectedResponse)
            .expect(200, done);
    });

    test('delete', (done) => {
        request(app)
            .delete('/users/1')
            .expect(204, done);
    });

    test('suggest', (done) => {
        const expectedResponse = [{
            login: testUserData.login,
            age: testUserData.age
        }];
        request(app)
            .get('/users/suggest?login=a&limit=10')
            .expect('Content-Type', /json/)
            .expect(expectedResponse)
            .expect(200, done);
    });
});
