import express from 'express';

import { configureUsersService } from '../config.js';
import { groupSchema, validateBody } from './validation.js';

const groupsRouter = express.Router();
const usersService = configureUsersService();

groupsRouter.route('/')
    .post(validateBody(groupSchema), async (req, res, next) => {
        try {
            const group = req.body;
            const groupData = await usersService.addGroup(group);
            res.json(groupData);
        } catch (error) {
            return next(error);
        }
    })
    .get(async (req, res, next) => {
        try {
            const groups = await usersService.getAllGroups();
            res.json(groups);
        } catch (error) {
            return next(error);
        }
    });

groupsRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            const group = await usersService.getGroup(req.params.id);
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ message: 'Group not found' });
            }
        } catch (error) {
            return next(error);
        }
    })
    .patch(validateBody(groupSchema), async (req, res, next) => {
        try {
            const groupData = req.body;
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
        try {
            const users = req.body;
            const groupId = req.params.id;
            const addedUsers = await usersService
                .addUsersToGroup(groupId, users);
            res.json({ addedUsers });
        } catch (error) {
            return next(error);
        }
    });

export { groupsRouter };
