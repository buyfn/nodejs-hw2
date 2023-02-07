import express from 'express';

import { configureUsersService } from '../config.js';
import { createUserResponse } from './createUserResponse.js';
import { userSchema, validateBody } from './validation.js';

const router = express.Router();
const usersService = configureUsersService();

router.get('/suggest', async (req, res, next) => {
    try {
        const { login, limit } = req.query;
        const suggestedUsers = await usersService.getSuggested(login, limit);
        res.json(suggestedUsers.map(createUserResponse));
    } catch (error) {
        return next(error);
    }
});

router.route('/:id')
    .get(async (req, res, next) => {
        try {
            const user = await usersService.find(req.params.id);

            if (user) {
                res.json(createUserResponse(user));
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            return next(error);
        }
    })
    .patch(validateBody(userSchema), async (req, res, next) => {
        try {
            const userData = req.body;
            const updatedUser = await usersService.update(
                req.params.id,
                userData
            );

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
            await usersService.remove(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            return next(error);
        }
    });


router.route('/')
    .post(validateBody(userSchema), async (req, res, next) => {
        try {
            const user = req.body;
            const userData = await usersService.add(user);
            res.json(createUserResponse(userData));
        } catch (error) {
            return next(error);
        }
    });

export { router as usersRouter };
