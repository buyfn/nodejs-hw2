import Joi from 'joi';
import _ from 'lodash';

export const userSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().pattern(/\d/).pattern(/[a-zA-Z]/).required(),
    age: Joi.number().min(4).max(130).required()
});

const errorResponse = (schemaErrors) => {
    const errors = schemaErrors.map(error => _.pick(error, ['path', 'message']));
    return {
        status: 'failed',
        errors
    };
};

export const validateUserBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error?.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            return next();
        }
    };
};
