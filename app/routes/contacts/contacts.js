'use strict';

const async = require('async');
const express = require('express');
const mongoose = require('mongoose');
const winston = require('../../../logger');
const router = express.Router();
const ContactModel = require('../../models/contact/ContactModel');
const CategoryModel = require('../../models/categories/CategoryModel');


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

    if (inputName && inputPhone && inputServices && inputServices.length > 0) {

        CategoryModel.find({code: {$in: inputServices}}).then(results => {

            let contactModel = new ContactModel({
                name: inputName,
                //city: inputCity,
                //state: inputState,
                phone: inputPhone,
                message: inputMessage,
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
    } else {
        res.status(401).json({message: "Bad Request"});
    }
});

module.exports = router;
