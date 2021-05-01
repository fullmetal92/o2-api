'use strict';

const _ = require('underscore');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const winston = require('../../../logger');
const CityModel = require('../../models/geographic/CityModel');
const StateModel = require('../../models/geographic/StateModel');

/**
 * Get all states
 */
router.get('/', function (req, res, next) {
    StateModel.find({}, {code: true, name: true}).then(states => {
        res.status(200).json(states)
    }).catch(err => {
        res.status(404).json({});
    })
});


/**
 * Get state by code
 */
router.get('/:code', function (req, res, next) {
    StateModel.find({
        code: req.params.code
    }).populate('cities').then((state) => {
        Object.keys(state).length === 0 ? res.status(404).json({}) : res.status(200).json(state);
    });
});

/**
 * Import state and city data
 */
router.post('/import', function (req, res, next) {

    winston.info('Starting state/city import');

    fs.readFile(path.join(__dirname, '../../data/state-city.json'), (err, data) => {
        if (err) throw err;
        let documents = JSON.parse(data);
        if (documents) {

            let groupedDocuments = _.chain(documents).groupBy('state')
                .map(function (value, key) {
                    return {
                        code: slugify(key.toLowerCase()),
                        name: key,
                        cities: _.pluck(value, 'city').map(function (value, key) {
                            return {
                                code: slugify(value.toLowerCase()),
                                name: value
                            }
                        })
                    }
                }).sortBy('code');

            groupedDocuments.forEach(state => {

                // Get state model
                let stateModel = new StateModel({
                    code: state.code,
                    name: state.name,
                });

                // Get list of city models
                let cityModelList = [];
                state.cities.forEach(city => {
                    let cityModel = new CityModel({
                        code: city.code,
                        name: city.name,
                        state: stateModel._id
                    });
                    cityModel.save().then(() => {
                    }).catch(err => winston.error(err));
                    cityModelList.push(cityModel);
                });

                stateModel.cities = cityModelList;
                stateModel.save().then(result => {
                    winston.info('Record saved: ' + result._doc.code);
                }).catch(err => {
                    winston.error(err);
                });
            });
            winston.info('Import complete!')
        } else {
            winston.error('No data found for import');
        }
        res.status(201).json({});
    });
});

module.exports = router;
