import express from 'express';
import helmet from 'helmet';
import config from './config';

const app = express();
app.use(helmet);
app.listen(config.server.port, config.server.host, () => {});
