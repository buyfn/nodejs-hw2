import express from 'express';

import { configureServices } from '../config.js';
import { logger } from '../logger.js';
import { createUserResponse } from './createUserResponse.js';
import { userSchema, validateBody } from './validation.js';
import { checkToken } from './auth.js';

const router = express.Router();
const { usersService } = configureServices();

router.use(checkToken);

router.get('/suggest', async (req, res, next) => {
    const { login, limit } = req.query;
    try {
        const suggestedUsers = await usersService.getSuggested(login, limit);
        res.json(suggestedUsers.map(createUserResponse));
    } catch (error) {
        logger.error({
            method: 'getSuggested',
            args: [login, limit],
            error: error.message
        });
        return next(error);
    }
});

router.route('/:id')
    .get(async (req, res, next) => {
        const userId = req.params.id;
        try {
            const user = await usersService.find(userId);

            if (user) {
                res.json(createUserResponse(user));
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            logger.error({
                method: 'find',
                args: [userId],
                error: error.message
            });
            return next(error);
        }
    })
    .patch(validateBody(userSchema), async (req, res, next) => {
        const userData = req.body;
        const userId = req.params.id;
        try {
            const updatedUser = await usersService.update(
                userId,
                userData
            );

            if (updatedUser) {
                res.json(createUserResponse(updatedUser));
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            logger.error({
                method: 'update',
                args: [userData, userId],
                error: error.message
            });
            return next(error);
        }
    })
    .delete(async (req, res, next) => {
        const userId = req.params.id;
        try {
            await usersService.remove(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            logger.error({
                method: 'remove',
                args: [userId],
                error: error.message
            });
            return next(error);
        }
    });


router.route('/')
    .post(validateBody(userSchema), async (req, res, next) => {
        const user = req.body;
        try {
            const userData = await usersService.add(user);
            res.json(createUserResponse(userData));
        } catch (error) {
            logger.error({
                method: 'add',
                args: [user],
                error: error.message
            });
            return next(error);
        }
    });

export { router as usersRouter };
