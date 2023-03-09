import { randomUUID } from 'node:crypto';

export const getGroupsService = repository => ({
    async addGroup(groupData) {
        const group = await repository.addGroup({
            ...groupData,
            id: randomUUID()
        });
        return group;
    },
    async updateGroup(id, groupData) {
        const group = await repository.updateGroup(id, groupData);
        return group;
    },
    async deleteGroup(id) {
        await repository.deleteGroup(id);
    },
    async getGroup(id) {
        const group = await repository.getGroup(id);
        return group;
    },
    async getAllGroups() {
        const groups = await repository.getAllGroups();
        return groups;
    },
    async addUsersToGroup(groupId, userIds) {
        const addedUserIds = await repository
            .addUsersToGroup(groupId, userIds);
        return addedUserIds;
    }
});
