'use strict';

const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const winston = require('./logger');
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD
});

client.hget = util.promisify(client.hget);

// create reference for .exec
const exec = mongoose.Query.prototype.exec;

/**
 * Ready Event
 */
client.on('ready', function () {
    winston.info('Successfully connected to redis cache!');
});

/**
 * Error Event
 */
client.on("error", function (error) {
    winston.error(error);
});

/**
 * Create new cache function on prototype
 * @returns {mongoose.Query}
 */
mongoose.Query.prototype.cache = function (...args) {
    this.useCache = true;
    this.expire = args[1] || 1800;
    this.hashKey = JSON.stringify(args[0] || this.mongooseCollection.name);
    return this;
};

/**
 * Override exec function to first check cache for data
 * @returns {Promise<*>}
 */
mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify({
        ...this.getQuery(),
        collection: this.mongooseCollection.name
    });

    // get cached value from redis
    const cacheValue = await client.hget(this.hashKey, key);

    // if cache value is not found, fetch data from mongodb and cache it
    if (!cacheValue) {
        const result = await exec.apply(this, arguments);
        client.hset(this.hashKey, key, JSON.stringify(result));
        client.expire(this.hashKey, this.expire);

        winston.info('Return data from MongoDB');
        return result;
    }

    // return found cachedValue
    const doc = JSON.parse(cacheValue);
    winston.info('Return data from Redis');
    return Array.isArray(doc)
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
