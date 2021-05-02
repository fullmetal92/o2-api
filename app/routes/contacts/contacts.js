
'use strict';

const async = require('async');
const express = require('express');
const mongoose = require('mongoose');
const winston = require('../../../logger');
const router = express.Router();
const ContactModel = require('../../models/contact/ContactModel');
const CategoryModel = require('../../models/categories/CategoryModel');
const StateModel = require('../../models/geographic/StateModel');
const CityModel = require('../../models/geographic/CityModel');

/**
 * Get contact by id
 */
// router.get('/:id', function (req, res, next) {
//     ContactModel.findOne({_id: req.params.id}).populate('categories').then(result => {
//         if (result) {
//             res.status(200).json(result);
//         } else {
//             res.status(404).json({});
//         }
//     }).catch(err => {
//         res.status(500).json(err);
//     })
// });

// router.get('/search', function (req, res, next) {
//
//     let queryId = req.query.id;
//     let queryState = req.query.state;
//     let queryCategories = req.query.categories || '';
//
//     if (queryCategories) {
//         queryCategories = queryCategories.split(',');
//     }
//
//     ContactModel.find({
//         // _id: queryId,
//         // state: queryState,
//         // categories: {$in: queryCategories}
//         $or: [
//             { _id: queryId },
//             { phone: req.query.phone },
//             //{ categories: {code: {$in: {queryCategories} } } }
//             { categories: {$in: {queryCategories} }}
//         ]
//     }).then(result => {
//         //console.log(result);
//         if (result) {
//             res.status(200).json(result)
//         } else {
//             res.status(200).json([]);
//         }
//     }).catch(err => {
//         res.status(400).json(err);
//     });
// });

/**
 * Create new contact
 */
router.post('/', function (req, res, next) {
    const inputName = req.body.name;
    const inputCity = req.body.city;
    const inputPhone = req.body.phone;
    const inputState = req.body.state;
    const inputMessage = req.body.message;
    const inputServices = req.body.services;
    if (inputName && inputPhone && inputServices && inputServices.length > 0 && inputCity && inputState) {
        saveContact(req.body, res);
    } else {
        res.status(401).json({message: "Bad Request"});
    }
});

router.get('/search', function(req, res, next) {
    getContacts(req, res); // TODO : add this in a helper file.
});

async function saveContact (request, res) {
    var state = await StateModel.findOne({code: request.state});
    var city = await CityModel.findOne({code: request.city});
    CategoryModel.find({code: {$in: request.services}}).then(results => {
        let contactModel = new ContactModel({
            name: request.name,
            city: city,
            state: state,
            phone: request.phone,
            message: request.message,
            categories: results
        });
        contactModel.save().then(result => {
            res.status(201).json({});
        }).catch(err => {
            res.status(500).json(err);
        })
    }).catch(err => {
        res.status(500).json(err);
    });
}

async function getContacts(req, res) {
    var state = await StateModel.findOne({code: req.query.state});
    var city = await CityModel.findOne({code: req.query.city});
    var category = await CategoryModel.findOne({code: req.query.category});
    ContactModel.
        find({categories: category, city: city, state: state}).
        exec((error, contacts) => {
            if (error) {
                res.status(400).json({error : 'We are facing issues while fetching the contacts!'})
            }
            res.status(201).json({contacts : contacts});
        });
}

module.exports = router;
