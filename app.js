const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes')

const app = express();

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.status(200).send('hello');
});

app.use(globalErrorHandler);

module.exports = app;