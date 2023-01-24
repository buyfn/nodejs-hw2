import { randomUUID } from 'node:crypto';

export const getUsersService = repository => ({
    async find(id) {
        const user = await repository.find(id);
        return user;
    },
    async add(userData) {
        const user = await repository.add({
            ...userData,
            id: randomUUID(),
            isDeleted: false
        });
        return user;
    },
    async update(id, userData) {
        const user = await repository.update(id, userData);
        return user;
    },
    async remove(id) {
        await repository.remove(id);
    },
    async getSuggested(loginSubstring = '', limit = 10) {
        const users = await repository.getSuggested(loginSubstring, limit);
        return users;
    }
});
