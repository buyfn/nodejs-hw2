import express from 'express';

import { configureUsersService } from '../config.js';
import { groupSchema, validateBody } from './validation.js';

const groupsRouter = express.Router();
const usersService = configureUsersService();

groupsRouter.route('/')
    .post(validateBody(groupSchema), async (req, res, next) => {
        const group = req.body;

        try {
            const groupData = await usersService.addGroup(group);
            res.json(groupData);
        } catch (error) {
            return next(error);
        }
    })
    .get(async (req, res) => {
        const groups = await usersService.getAllGroups();
        res.json(groups);
    });

groupsRouter.route('/:id')
    .get(async (req, res) => {
        const group = await usersService.getGroup(req.params.id);

        if (group) {
            res.json(group);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    })
    .patch(validateBody(groupSchema), async (req, res, next) => {
        const groupData = req.body;
        try {
            const updatedGroup = await usersService.updateGroup(
                req.params.id,
                groupData
            );
            res.json(updatedGroup);
        } catch (error) {
            return next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            await usersService.deleteGroup(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            return next(error);
        }
    })
    .post(async (req, res, next) => {
        const users = req.body;
        const groupId = req.params.id;
        try {
            const addedUsers = await usersService
                .addUsersToGroup(groupId, users);
            res.json({ addedUsers });
        } catch (error) {
            return next(error);
        }
    });

export { groupsRouter };
