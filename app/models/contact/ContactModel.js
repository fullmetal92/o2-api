'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {type: String, required: true, maxlength: 255},
    phone: {type: String, required: true, maxlength: 10},
    message: {type: String, maxlength: 2064},
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
