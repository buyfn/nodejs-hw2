import _ from 'lodash';

export const createUserResponse = (userData) =>
    _.pick(userData, ['login', 'age', 'id']);
