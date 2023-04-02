import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { logger } from '../logger.js';

import { configureServices } from '../config.js';

const { usersService } = configureServices();

export const checkToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    const secret = process.env.SECRET;

    try {
        jwt.verify(token, secret);
    } catch (error) {
        logger.warn({
            message: error.message
        });
        res.status(403).send({ message: error.message });
    }

    return next();
};

export const handleLogin = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(401).send({
            message: 'Bad username/password combination'
        });
    }

    const user = await usersService.getByLogin(login);
    if (!user) {
        return res.status(401).send({
            message: 'Bad username/password combination'
        });
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );
    if (!passwordMatches) {
        return res.status(401).send({
            message: 'Bad username/password combination'
        });
    }

    const payload = { sub: user.id };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: 120 });

    res.send(`Bearer ${token}`);
};
