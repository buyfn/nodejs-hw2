import { v4 as uuidv4 } from 'uuid';

import { validateUser } from './validation.js';

class NotFoundError extends Error {
    constructor(id, ...params) {
        super(...params);
        this.name = 'NotFoundError';
        this.id = id;
        this.message = `User ${id} not found`;
    }
}

let users = [];

const findUser = (id) =>
    users.find(user => user.id === id && !user.isDeleted);

const addUser = (user) => {
    const id = uuidv4();
    const newUser = {
        ...user,
        id,
        isDeleted: false
    };
    users.push(newUser);

    return newUser;
};

const updateUser = (id, data) => {
    const user = findUser(id);

    if (user) {
        const updatedUser = { ...user, ...data };
        users = [
            ...users.filter(u => u.id !== id),
            updatedUser
        ];

        return updatedUser;
    }

    throw new NotFoundError(id);
};

const removeUser = (id) => {
    const userToRemove = findUser(id);

    if (userToRemove) {
        users = [
            ...users.filter(user => user.id !== id),
            { ...userToRemove, isDeleted: true }
        ];

        return id;
    }

    throw new NotFoundError(id);
};

const getSuggestedUsers = (loginSubstring, limit = 10) => users
    .filter(user => !user.isDeleted)
    .filter(user => user.login.includes(loginSubstring))
    .sort((userA, userB) => {
        if (userA.login < userB.login) {
            return -1;
        }
        if (userA.login > userB.login) {
            return 1;
        }
        return 0;
    })
    .slice(0, limit);

const opMap = {
    find: { op: findUser },
    add: {
        op: addUser,
        validate: (userData) => [validateUser(userData)]
    },
    update: {
        op: updateUser,
        validate: (id, userData) => [id, validateUser(userData)]
    },
    remove: { op: removeUser },
    suggest: { op: getSuggestedUsers }
};

export const api = Object.keys(opMap)
    .reduce((acc, opName) => {
        const { op, validate } = opMap[opName];
        return {
            ...acc,
            [opName]: (...args) => validate ?
                op(...validate(...args)) :
                op(...args)
        };
    }, {});
