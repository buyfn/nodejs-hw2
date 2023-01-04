import Joi from 'joi';

export const userSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().pattern(/\d/).pattern(/[a-zA-Z]/).required(),
    age: Joi.number().min(4).max(130).required()
});

export const validateUser = (userData) => {
    const { error, value } = userSchema.validate(userData, {
        abortEaryly: false,
        allowUnknown: false
    });

    if (error) {
        throw error;
    }

    return value;
};
