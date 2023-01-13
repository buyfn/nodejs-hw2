import express from 'express';
import _ from 'lodash';

import { userService } from '../services/users-db/index.js';
import { userSchema, validateUserBody } from '../validation.js';

const router = express.Router();

const createUserResponse = (userData) =>
    _.pick(userData, ['login', 'age', 'id']);

router.get('/users/suggest', async (req, res) => {
    const { login, limit } = req.query;
    const suggestedUsers = await userService.getSuggested(login, limit);

    res.json(suggestedUsers.map(createUserResponse));
});

router.route('/users/:id')
    .get(async (req, res) => {
        const user = await userService.find(req.params.id);

        if (user) {
            res.json(createUserResponse(user));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
    .patch(validateUserBody(userSchema), async (req, res, next) => {
        const userData = req.body;
        try {
            const updatedUser = await userService.update(req.params.id, userData);

            if (updatedUser) {
                res.json(createUserResponse(updatedUser));
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            return next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            await userService.remove(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            return next(error);
        }
    });


router.route('/users')
    .post(validateUserBody(userSchema), async (req, res, next) => {
        const user = req.body;

        try {
            const userData = await userService.add(user);
            res.json(createUserResponse(userData));
        } catch (error) {
            return next(error);
        }
    });

router.use((error, req, res, next) => {
    res.status(500).json({
        message: 'Intrernal server error'
    });
    next();
});

export { router };
