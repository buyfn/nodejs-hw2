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
    }
};
