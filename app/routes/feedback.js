const express = require('express');
const router = express.Router();
const FeedbackModel = require('../models/misc/FeedbackModel');
const validator = require('../validator/validator');

router.post('/', validator.feedbackValidation, function(req, res, next) {
        const feedbackModel = new FeedbackModel({
            'rating': req.body.rating,
            'email': req.body.email,
            'message': req.body.message
        });

        feedbackModel.save()
            .then(() => {
                res.status(200).json({
                    message: 'Thank you for Feedback!'
                })
            })
            .catch((error) => {
                res.status(400).json({
                    error:error
                });
            })
    });

module.exports = router;