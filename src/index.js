import express from 'express';
import cors from 'cors';

import { usersRouter, groupsRouter } from './api/index.js';
import { logger } from './logger.js';
import { handleLogin } from './api/auth.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    logger.info({
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query
    });
    next();
});

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.post('/login', handleLogin);

app.use((error, req, res, next) => {
    logger.error({
        method: req.method,
        message: error.message
    });
    res.status(500).json({
        message: 'Intrernal server error'
    });
    next();
});

process.on('uncaughtException', (error, origin) => {
    logger.error({
        error: error.message,
        origin
    });
});

process.on('unhandledRejection', (reason, promise) => {
    logger.warn({
        reason,
        promise
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}\n`);
});
