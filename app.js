import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import AppError from './utils/error.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

export default app;
