'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
    code: {type: String, required: true},
    name: {type: String},
    state: {
        type: Schema.Types.ObjectId,
        ref: 'State'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const City = mongoose.model('City', citySchema);
module.exports = City;
