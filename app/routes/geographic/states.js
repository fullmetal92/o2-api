'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const winston = require('../../../logger');
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
    }).then((state) => {
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

            // // Sort Documents
            // let sortedDocuments = documents.sort(function(a, b){
            //     let textA = a.name.toUpperCase();
            //     let textB = b.name.toUpperCase();
            //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            // });

            // Get list of states
            let listOfStates = documents.map(o => o.state);

            // Remove duplicates
            listOfStates = listOfStates.filter(function (elem, pos) {
                return listOfStates.indexOf(elem) === pos;
            });

            // Sort by alphanumeric order
            let sortedStateList = listOfStates.sort(function (a, b) {
                let textA = a.toUpperCase();
                let textB = b.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            // Save to database
            sortedStateList.forEach((stateName) => {
                let stateModel = new StateModel({
                    code: stateName.toLowerCase(),
                    name: stateName
                });
                stateModel.save().then((result) => {
                    winston.info('Saved State :' + result._doc.code);
                }).catch((err) => {
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
