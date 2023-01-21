import './config.js';
import express from 'express';


import { router } from './api/index.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());
app.use('/', router);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}\n`);
});
