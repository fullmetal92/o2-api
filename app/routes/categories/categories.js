'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const winston = require('../../../logger');
const router = express.Router();
const CategoryModel = require('../../models/categories/CategoryModel');

/**
 * Get all categories
 */
router.get('/', function (req, res, next) {
    CategoryModel.find({}).cache('categories', 2592000).then(function (categories) {
        res.status(200).json(categories);
    });
});

/**
 * Get category by code
 */
router.get('/:code', function (req, res, next) {
    CategoryModel.find({
        code: req.params.code
    }).then(function (category) {
        Object.keys(category).length === 0 ? res.status(404).json({}) : res.status(200).json(category);
    });
});

/**
 * Create new category
 */
router.post('/', function (req, res, next) {

    const categoryModel = new CategoryModel({
        code: req.body.code,
        name: req.body.name,
        icon: req.body.icon
    });

    categoryModel.save().then(() => {
        res.status(201).json({});
    }).catch((error) => {
        res.status(400).json({
            error: error
        });
    });
});

/**
 * Import all category from data source
 */
router.post('/import', function (req, res, next) {

    winston.info('Starting category import');

    fs.readFile(path.join(__dirname, '../../data/categories.json'), (err, data) => {
        if (err) throw err;
        let categories = JSON.parse(data);
        if (categories) {
            categories.forEach(category => {
                let categoryModel = new CategoryModel({
                    code: category.code,
                    name: category.name,
                    icon: category.icon
                });
                categoryModel.save().then(() => {
                    winston.info('Record Saved')
                }).catch((error) => {
                    winston.error(error);
                });
            });
            winston.info('Import Completed!');
        } else {
            winston.error('No data found for import');
        }
        res.status(201).json({});
    });
});

module.exports = router;
