const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');

const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();
require('./utils/passport');

// Configuración de passport para la session
app.use(session({ secret: process.env.JWT_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).send('hello');
});

app.use(globalErrorHandler);

module.exports = app;