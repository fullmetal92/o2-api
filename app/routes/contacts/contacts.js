'use strict';

const async = require('async');
const express = require('express');
const winston = require('../../../logger');
const router = express.Router();
const ContactModel = require('../../models/contact/ContactModel');
const CategoryModel = require('../../models/categories/CategoryModel');

/**
 * Create new contact
 */
router.post('/', function (req, res, next) {

    const inputName = req.body.name;
    const inputPhone = req.body.phone;
    const inputMessage = req.body.message;
    const inputServices = req.body.services;

    if (inputName && inputPhone && inputServices && inputServices.length > 0) {

        CategoryModel.find({code: {$in: inputServices}}).then(results => {

            let contactModel = new ContactModel({
                name: inputName,
                phone: inputPhone,
                message: inputMessage,
                services: results
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
