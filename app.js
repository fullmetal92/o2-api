const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const winston = require('./logger');
const mongoose = require('mongoose');
const config = require('./config').get(process.env.NODE_ENV);

const indexRouter = require('./app/routes/index');
const sandboxRouter = require('./app/routes/misc/sandbox');
const statesRouter = require('./app/routes/geographic/states');
const categoryRouter = require('./app/routes/categories/categories');


const app = express();

/**
 * Database configuration
 * Reference: http://mongoosejs.com/docs/connections.html
 */
mongoose.connect(config.database.url, config.database.options);

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'app','public'));
app.set('view engine', 'hbs');


/**
 * App Configuration
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */
app.use('/', indexRouter);
app.use('/states', statesRouter);
app.use('/sandbox', sandboxRouter);
app.use('/categories', categoryRouter);

/**
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next) {
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
