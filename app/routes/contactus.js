const express = require('express');
const router = express.Router();
const ContactUSModel = require('../models/misc/ContactusModel');
const {body, validationResult} = require('express-validator');
const validator = require('../validator/validator');

router.post('/', validator.contactusValidation, function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
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