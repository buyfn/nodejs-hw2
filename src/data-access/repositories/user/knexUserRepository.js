import { db } from '../../db.js';

export const userRepository = {
    async getSuggested(loginSubstring, limit) {
        const users = await db('users')
            .where('isDeleted', false)
            .whereLike('login', `%${loginSubstring}%`)
            .orderBy('login')
            .limit(limit);
        return users;
    },

    async find(id) {
        const [user] = await db('users')
            .where({
                id,
                'isDeleted': false
            });
        return user;
    },

    async add(userData) {
        const [user] = await db('users')
            .insert(userData)
            .returning('*');
        return user;
    },

    async update(id, userData) {
        const [user] = await db('users')
            .where({
                id,
                'isDeleted': false
            })
            .update(userData)
            .returning('*');
        return user;
    },

    async remove(id) {
        await db('users')
            .where('id', id)
            .update({ isDeleted: true });
    },

    async getByLogin(login) {
        const [user] = await db('users')
            .where({
                login,
                'isDeleted': false
            });
        return user;
    },

    async getAllGroups() {
        const groups = await db('groups');
        return groups;
    },

    async getGroup(id) {
        const [group] = await db('groups')
            .where({ id });
        return group;
    },

    async addGroup(groupData) {
        const [group] = await db('groups')
            .insert(groupData)
            .returning('*');
        return group;
    },

    async updateGroup(id, groupData) {
        const [group] = await db('groups')
            .where('id', id)
            .update(groupData)
            .returning('*');
        return group;
    },

    async deleteGroup(id) {
        await db('groups')
            .where('id', id)
            .del();
    },

    async addUsersToGroup(groupid, userIds) {
        const addedUsers = await db('usergroup')
            .insert(userIds.map(userid => ({ groupid, userid })))
            .returning('userid');
        return addedUsers;
    }
};
