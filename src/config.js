import 'dotenv/config.js';

import { getUsersService } from './services/users.js';
import {
    knexUserRepository,
    inMemoryUserRepository
} from './data-access/repositories/user/index.js';

export const configureUsersService = () => {
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

    return getUsersService(getRepository(storage));
};
