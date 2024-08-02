const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bookRoute = require('./routes/BookRoute');
const userRoute = require('./routes/userRoute');

app.use(express.json());

app.use(cookieParser());
app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    res.status(204).end();
  } else {
    next();
  }
});
//routes
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/users', userRoute);
app.all('*', (req, res, next) => {
  next(new Error(`can not find ${req.originalUrl} on this server`, 404));
});


module.exports = app;