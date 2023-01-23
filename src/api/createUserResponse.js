export const createUserResponse = (userData) => {
    const { login, age, id } = userData;
    return { login, age, id };
};
