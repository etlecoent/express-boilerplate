import type { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.message, err.stack);
  res.status(500).json({
    error: 'Oops, something went wrong...'
  });
};

export default errorMiddleware;
