import express from 'express';
import _ from 'lodash';
import { api as users } from './users.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();
const router = express.Router();

app.use(express.json());

const createUserResponse = (userData) =>
    _.pick(userData, ['login', 'age', 'id']);

const errorStatusMap = {
    ValidationError: 400,
    NotFoundError: 404
};

router.route('/users/suggest')
    .get((req, res) => {
        const { login, limit } = req.query;
        const suggestedUsers = users.suggest(login, limit).map(createUserResponse);

        res.json(suggestedUsers);
    });

router.route('/users')
    .post((req, res) => {
        const user = req.body;
        try {
            const newUser = users.add(user);
            res.json(createUserResponse(newUser));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/users/:id')
    .get((req, res) => {
        const user = users.find(req.params.id);

        if (user) {
            res.json(createUserResponse(user));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
    .patch((req, res) => {
        const userData = req.body;
        try {
            const newUser = users.update(req.params.id, userData);
            res.json(createUserResponse(newUser));
        } catch (error) {
            const status = errorStatusMap[error.name];
            res.status(status).json({ message: error.message });
        }
    })
    .delete((req, res) => {
        try {
            users.remove(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    });

app.use('/', router);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}\n`);
});
