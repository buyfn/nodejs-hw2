import express from 'express';

import { usersRouter, groupsRouter } from './api/index.js';
import { logger } from './logger.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());

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
