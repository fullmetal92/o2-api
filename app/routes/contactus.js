const express = require('express');
const router = express.Router();
const ContactUSModel = require('../models/misc/ContactusModel');

router.post('/', function(req, res, next) {
    const contactUSModel = new ContactUSModel({
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'email': req.body.email,
        'phone': req.body.phone,
        'message': req.body.message
    });

    contactUSModel.save()
        .then(() => {
            res.status(200).json({
                message: 'Thank you for Contacting US! Your Data is saved successfully'
            })
        })
        .catch((error) => {
            res.status(400).json({
                error:error
            });
        })
});

module.exports = router;