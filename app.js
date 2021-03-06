const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const winston = require('./logger');
const mongoose = require('mongoose')
const config = require('dotenv').config();
const cache  = require('./cache');

const indexRouter = require('./app/routes/index');
const sandboxRouter = require('./app/routes/misc/sandbox');
const citiesRouter = require('./app/routes/geographic/cities');
const statesRouter = require('./app/routes/geographic/states');
const contactsRouter = require('./app/routes/contacts/contacts');
const categoryRouter = require('./app/routes/categories/categories');

const contactUsRouter = require('./app/routes/contactus');
const feedbackRouter = require('./app/routes/feedback');

const app = express();

/**
 * Database configuration
 * Reference: http://mongoosejs.com/docs/connections.html
 */
mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(r => {
    winston.info('Successfully connected to database!');
}).catch(err => {
    winston.error('Failed to connect to the database', err);
});

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'app', 'public'));
app.set('view engine', 'hbs');


/**
 * App Configuration
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */
app.use('/', indexRouter);
app.use('/images', express.static(path.join(__dirname, 'app', 'public', 'images')));
app.use('/cities', citiesRouter);
app.use('/states', statesRouter);
app.use('/sandbox', sandboxRouter);
app.use('/contacts', contactsRouter);
app.use('/categories', categoryRouter);
app.use('/contact-us', contactUsRouter);
app.use('/feedback', feedbackRouter);

/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        code: err.status,
        error: err.message
    });
});

module.exports = app;
