const express = require('express');
const router = express.Router();
const SandboxModel = require('../../models/misc/SandboxModel');

/**
 * Get all instances
 */
router.get('/all', function (req, res, next) {
    SandboxModel.find({}).then(function (items) {
        res.status(200).json(items);
    });
});

/**
 * Save a new sandbox instance
 */
router.post('/', function (req, res, next) {

    const sandboxModel = new SandboxModel({
        'firstName': req.body.firstName,
        'lastName': req.body.lastName
    });

    sandboxModel.save()
        .then(() => {
            res.status(200).json({
               message: 'Data saved successfully!'
            });
        })
        .catch((error) => {
            res.status(400).json({
               error: error
            });
        });
});

module.exports = router;

