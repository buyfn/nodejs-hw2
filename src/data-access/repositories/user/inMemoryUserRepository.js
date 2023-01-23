let users = [];

const find = (id) =>
    users.find(user => user.id === id && !user.isDeleted);

const add = (user) => {
    users.push(user);

    return user;
};

const update = (id, data) => {
    const user = find(id);

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

const remove = (id) => {
    const userToRemove = find(id);

    if (userToRemove) {
        users = [
            ...users.filter(user => user.id !== id),
            { ...userToRemove, isDeleted: true }
        ];
    }
};

const getSuggested = (loginSubstring, limit) => {
    return users
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
};

export const userRepository = {
    getSuggested,
    find,
    add,
    update,
    remove
};
