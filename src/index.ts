import express from 'express';
import config from './config';

const app = express();

app.listen(config.server.port, config.server.host, () => {});