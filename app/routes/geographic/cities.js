'use strict';

const express = require('express');
const router = express.Router();

const CityModel = require('../../models/geographic/CityModel');
const StateModel = require('../../models/geographic/StateModel');

/**
 * Get all cities
 */
router.get('/', function(req, res, next){
   CityModel.find({}).then(cities => {
        res.status(200).json(cities);
   }).catch(err => {
       res.status(400).json({});
   });
});

router.get('/:state', function(req, res, next) {

    StateModel.find({code: req.params.state}).then(result => {
        CityModel.find({ state: result}).then(results => {
            res.status(200).json(results);
        }).then(err => {
            res.status(404).json({});
        });
    }).catch(err => {
        res.status(404).json({});
    });
});

module.exports = router;
