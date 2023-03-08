import express from 'express';

import { logger } from '../logger.js';
import { configureServices } from '../config.js';
import { groupSchema, validateBody } from './validation.js';

const groupsRouter = express.Router();
const { groupsService } = configureServices();

groupsRouter.route('/')
    .post(validateBody(groupSchema), async (req, res, next) => {
        const group = req.body;
        try {
            const groupData = await groupsService.addGroup(group);
            res.json(groupData);
        } catch (error) {
            logger.error({
                method: 'addGroup',
                args: [group],
                error: error.message
            });
            return next(error);
        }
    })
    .get(async (req, res, next) => {
        try {
            const groups = await groupsService.getAllGroups();
            res.json(groups);
        } catch (error) {
            logger.error({
                method: 'getAllGroups',
                args: [],
                error: error.message
            });
            return next(error);
        }
    });

groupsRouter.route('/:id')
    .get(async (req, res, next) => {
        const groupId = req.params.id;
        try {
            const group = await groupsService.getGroup(req.params.id);
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ message: 'Group not found' });
            }
        } catch (error) {
            logger.error({
                method: 'getGroup',
                args: [groupId],
                error: error.message
            });
            return next(error);
        }
    })
    .patch(validateBody(groupSchema), async (req, res, next) => {
        const groupData = req.body;
        const groupId = req.params.id;
        try {
            const updatedGroup = await groupsService.updateGroup(
                groupId,
                groupData
            );
            res.json(updatedGroup);
        } catch (error) {
            logger.error({
                method: 'updateGroup',
                args: [groupId, groupData],
                error: error.message
            });
            return next(error);
        }
    })
    .delete(async (req, res, next) => {
        const groupId = req.params.id;
        try {
            await groupsService.deleteGroup(groupId);
            res.sendStatus(204);
        } catch (error) {
            logger.error({
                method: 'deleteGroup',
                args: [groupId],
                error: error.message
            });
            return next(error);
        }
    })
    .post(async (req, res, next) => {
        const users = req.body;
        const groupId = req.params.id;
        try {
            const addedUsers = await groupsService
                .addUsersToGroup(groupId, users);
            res.json({ addedUsers });
        } catch (error) {
            logger.error({
                method: 'addUsersToGroup',
                args: [groupId, users],
                error: error.message
            });
            return next(error);
        }
    });

export { groupsRouter };
