import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const PORT = Number(process.env.PORT) || 3000;
const app = express();
app.use(express.json());

let users = [];
const PROPERTIES = [
    'login',
    'password',
    'age'
];

const findUser = (id) => users
    .filter(user => !user.isDeleted)
    .find(user => user.id === id);

const addUser = (user) => {
    const id = uuidv4();
    users.push({
        ..._.pick(user, PROPERTIES),
        id,
        isDeleted: false
    });

    return id;
};

const updateUser = (id, data) => {
    const user = findUser(id);

    if (user) {
        users = [
            ...users.filter(u => u.id !== id),
            {
                ...user,
                ..._.pick(data, PROPERTIES)
            }
        ];
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
    const suggestedUsers = getSuggestedUsers(login, limit);

    res.json(suggestedUsers);
});

router.route('/users/:id')
    .get((req, res) => {
        const user = findUser(req.params.id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
    .post((req, res) => {
        const userData = req.body;
        updateUser(req.params.id, userData);

        res.sendStatus(204);
    })
    .delete((req, res) => {
        removeUser(req.params.id);

        res.sendStatus(204);
    });

router.route('/users')
    .put((req, res) => {
        const user = req.body;
        const id = addUser(user);

        res.json({ id });
    });

app.use('/', router);
app.listen(PORT);
process.stdout.write(`Server started on port ${PORT}\n`);
