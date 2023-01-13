import express from 'express';
import _ from 'lodash';

import {
    findUser,
    addUser,
    updateUser,
    removeUser,
    getSuggestedUsers
} from './users-in-memory/index.js';
import { userSchema, validateUserBody } from './validation.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();
app.use(express.json());

const createUserResponse = (userData) =>
    _.pick(userData, ['login', 'age', 'id']);

const router = express.Router();

router.get('/users/suggest', (req, res) => {
    const { login, limit } = req.query;
    const suggestedUsers = getSuggestedUsers(login, limit)
        .map(createUserResponse);

    res.json(suggestedUsers);
});

router.route('/users/:id')
    .get((req, res) => {
        const user = findUser(req.params.id);

        if (user) {
            res.json(createUserResponse(user));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
    .patch(validateUserBody(userSchema), (req, res) => {
        const userData = req.body;
        const updatedUser = updateUser(req.params.id, userData);

        res.json(createUserResponse(updatedUser));
    })
    .delete((req, res) => {
        removeUser(req.params.id);

        res.sendStatus(204);
    });


router.route('/users')
    .post(validateUserBody(userSchema), (req, res) => {
        const user = req.body;
        const userData = addUser(user);

        res.json(createUserResponse(userData));
    });

router.use((error, req, res, next) => {
    res.status(500).json({ message: 'Intrernal server error' });
    next();
});

app.use('/', router);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}\n`);
});
