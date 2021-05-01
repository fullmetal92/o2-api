const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sandboxSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 100},
    lastName: {type: String, required: true, maxLength: 100},
    meta: {
        platform: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Sandbox = mongoose.model('Sandbox', sandboxSchema);
module.exports = Sandbox;


