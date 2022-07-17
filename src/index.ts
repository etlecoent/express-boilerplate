import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import config from './config';

const app = express();

// Set appropriate headers for security
app.use(helmet);
// Remove x-powered-by header
app.disable('x-powered-by');

// Properly parse content
app.use(bodyParser);

app.listen(config.server.port, config.server.host, () => {});
