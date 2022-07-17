import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import errorMiddleware from './errorMiddleware';
import config from './config';

const app = express();

// Set appropriate headers for security
app.use(helmet());
// Remove x-powered-by header
app.disable('x-powered-by');

// Log incoming requests
app.use(morgan('common'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Handle errors passed to next function, needs to be last middleware
app.use(errorMiddleware);

app.get('/', (req, res, next) => {
  res.send('Hello World!');
});

app.listen(config.server.port, config.server.host, () => {
  console.log(`Server started on ${config.server.host}:${config.server.port}`);
});
