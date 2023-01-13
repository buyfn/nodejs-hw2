import { db } from '../db.js';

export const User = {
    async getSuggested(loginSubstring, limit = 10) {
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
            .returning(['id', 'login', 'age']);
        return user;
    },
    async update(id, userData) {
        const [user] = await db('users')
            .where({
                id,
                'isDeleted': false
            })
            .update(userData)
            .returning(['id', 'login', 'age']);

        return user;
    },
    async remove(id) {
        await db('users')
            .where('id', id)
            .update({ isDeleted: true });
    }
};
