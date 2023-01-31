import express from 'express';

import { usersRouter, groupsRouter } from './api/index.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use((error, req, res, next) => {
    res.status(500).json({
        message: 'Intrernal server error'
    });
    next();
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}\n`);
});
