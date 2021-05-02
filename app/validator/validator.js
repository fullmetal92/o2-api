const {body, validationResult} = require('express-validator');

const contactusValidator = () => [
    body('email').isEmail().not().isEmpty().trim().escape(),
    body('firstName').not().isEmpty().trim().escape(),
    body('lastName').not().isEmpty().trim().escape(),
    body('phone').not().isEmpty().trim().escape(),
    body('message').not().isEmpty().trim().escape()
];

const feedbackValidator = () => [
    body('email').isEmail().not().isEmpty().trim().escape(),
    body('message').not().isEmpty().trim().escape(),
    body('rating').not().isEmpty().isInt()
];

const reporter = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}

module.exports = {
    contactusValidation: [contactusValidator(), reporter],
    feedbackValidation: [feedbackValidator(), reporter]
}