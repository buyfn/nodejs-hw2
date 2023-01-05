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
    .post((req, res, next) => {
        const user = req.body;
        try {
            const newUser = users.add(user);
            res.json(createUserResponse(newUser));
        } catch (error) {
            return next(error);
        }
    });

router.route('/users/:id')
    .get((req, res, next) => {
        try {
            const user = users.find(req.params.id);
            res.json(user);
        } catch (error) {
            return next(error);
        }
    })
    .patch((req, res, next) => {
        const userData = req.body;
        try {
            const newUser = users.update(req.params.id, userData);
            res.json(createUserResponse(newUser));
        } catch (error) {
            return next(error);
        }
    })
    .delete((req, res, next) => {
        try {
            users.remove(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            return next(error);
        }
    });

router.use((error, req, res, next) => {
    const status = errorStatusMap[error.name];
    res.status(status).json({ message: error.message });
    next();
});

app.use('/', router);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}\n`);
});
