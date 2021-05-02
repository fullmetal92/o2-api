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
 * Create new contact
 */
router.post('/', function (req, res, next) {

    const inputName = req.body.name;
    const inputCity = req.body.city;
    const inputPhone = req.body.phone;
    const inputState = req.body.state;
    const inputMessage = req.body.message;
    const inputCategories = req.body.categories;

    if (inputName && inputPhone && inputCategories && inputCategories.length > 0 && inputCity && inputState) {
        saveContact(req.body).then(result => {
            res.status(201).json({});
        }).catch(err => {
            res.status(500).json(err);
        });
    } else {
        res.status(401).json({message: "Bad Request"});
    }
});

router.get('/search', function (req, res, next) {
    getContacts(req).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});

async function saveContact(req) {

    const state = await StateModel.findOne({code: req.state}).exec();
    const city = await CityModel.findOne({code: req.city}).exec();

    return CategoryModel.find({code: {$in: req.categories}}).then(results => {
        let contactModel = new ContactModel({
            name: req.name,
            city: city,
            state: state,
            phone: req.phone,
            message: req.message,
            categories: results
        });
        contactModel.save().then(result => {
            return result;
        }).catch(err => {
            throw err;
        })
    }).catch(err => {
        throw err;
    });
}

async function getContacts(req) {

    const state = await StateModel.findOne({code: req.query.state});
    const city = await CityModel.findOne({code: req.query.city});
    const category = await CategoryModel.findOne({code: req.query.category});

    return ContactModel.find({categories: category, city: city, state: state}).then(result => {
        return result;
    }).catch(err => {
        throw err;
    });
}

module.exports = router;
