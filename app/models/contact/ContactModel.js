'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {type: String, required: true, maxlength: 255},
    phone: {type: String, required: true, maxlength: 10, unique: true},
    message: {type: String, maxlength: 2064},
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State'
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City'
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    rating: {type: Number, default: 0}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
