import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import { userSchema, validateSchema } from './validation.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();
app.use(express.json());

let users = [];

const createUserResponse = (userData) =>
    _.pick(userData, ['login', 'age', 'id']);

const findUser = (id) =>
    users.find(user => user.id === id && !user.isDeleted);

const addUser = (user) => {
    const id = uuidv4();
    const newUser = {
        ...user,
        id,
        isDeleted: false
    };
    users.push(newUser);

    return newUser;
};

const updateUser = (id, data) => {
    const user = findUser(id);

    if (user) {
        const updatedUser = { ...user, ...data };
        users = [
            ...users.filter(u => u.id !== id),
            updatedUser
        ];

        return updatedUser;
    }
};

const removeUser = (id) => {
    const userToRemove = findUser(id);

    if (userToRemove) {
        users = [
            ...users.filter(user => user.id !== id),
            { ...userToRemove, isDeleted: true }
        ];
    }
};

const getSuggestedUsers = (loginSubstring, limit = 10) => users
    .filter(user => !user.isDeleted)
    .filter(user => user.login.includes(loginSubstring))
    .sort((userA, userB) => {
        if (userA.login < userB.login) {
            return -1;
        }
        if (userA.login > userB.login) {
            return 1;
        }
        return 0;
    })
    .slice(0, limit);

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
    .patch(validateSchema(userSchema), (req, res) => {
        const userData = req.body;
        const updatedUser = updateUser(req.params.id, userData);

        res.json(createUserResponse(updatedUser));
    })
    .delete((req, res) => {
        removeUser(req.params.id);

        res.sendStatus(204);
    });


router.route('/users')
    .post(validateSchema(userSchema), (req, res) => {
        const user = req.body;
        const userData = addUser(user);

        res.json(createUserResponse(userData));
    });

app.use('/', router);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}\n`);
});
