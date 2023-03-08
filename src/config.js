import 'dotenv/config.js';

import { getUsersService } from './services/users.js';
import { getGroupsService } from './services/groups.js';
import {
    knexUserRepository,
    inMemoryUserRepository
} from './data-access/repositories/user/index.js';

export const configureServices = () => {
    const getRepository = (storage) => {
        switch (storage) {
            case 'db':
                return knexUserRepository;
            case 'memory':
            default:
                return inMemoryUserRepository;
        }
    };

    const storage = process.env.STORAGE || 'memory';
    const repository = getRepository(storage);

    return {
        usersService: getUsersService(repository),
        groupsService: getGroupsService(repository)
    };
};
