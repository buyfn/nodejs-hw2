import { v4 as uuidv4 } from 'uuid';

let users = [];

export const findUser = (id) =>
    users.find(user => user.id === id && !user.isDeleted);

export const addUser = (user) => {
    const id = uuidv4();
    const newUser = {
        ...user,
        id,
        isDeleted: false
    };
    users.push(newUser);

    return newUser;
};

export const updateUser = (id, data) => {
    const user = findUser(id);

    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = { ...user, ...data };
    users = [
        ...users.filter(u => u.id !== id),
        updatedUser
    ];

    return updatedUser;
};

export const removeUser = (id) => {
    const userToRemove = findUser(id);

    if (!userToRemove) {
        throw new Error('User not found');
    }

    users = [
        ...users.filter(user => user.id !== id),
        { ...userToRemove, isDeleted: true }
    ];
};

export const getSuggestedUsers = (loginSubstring, limit = 10) => users
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
