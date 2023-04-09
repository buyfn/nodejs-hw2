import request from 'supertest';
import express from 'express';

import { groupsRouter } from './groups.js';

const app = express();

app.use(express.json());
app.use('/groups', groupsRouter);

const testGroupData = {
    name: 'test group',
    permissions: ['READ', 'WRITE']
};

jest.mock('./auth.js', () => ({
    checkToken: jest.fn().mockImplementation((req, res, next) => {
        next();
    })
}));
jest.mock('../config.js', () => ({
    configureServices: jest.fn().mockImplementation(() => ({
        groupsService: {
            addGroup: jest.fn().mockImplementation(() => testGroupData),
            getAllGroups: jest.fn().mockImplementation(() => [testGroupData]),
            getGroup: jest.fn().mockImplementation(() => testGroupData),
            updateGroup: jest.fn().mockImplementation(() => testGroupData),
            deleteGroup: jest.fn(),
            addUsersToGroup: jest.fn().mockImplementation(() => [])
        }
    }))
}));

describe('Groups route', () => {
    test('add', (done) => {
        request(app)
            .post('/groups')
            .send(testGroupData)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('get all', (done) => {
        request(app)
            .get('/groups')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('get group', (done) => {
        request(app)
            .get('/groups/1')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('update', (done) => {
        request(app)
            .patch('/groups/1')
            .send(testGroupData)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    test('delete', (done) => {
        request(app)
            .delete('/groups/1')
            .expect(204, done);
    });

    test('add users to group', (done) => {
        request(app)
            .post('/groups/1')
            .send(['user id'])
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
