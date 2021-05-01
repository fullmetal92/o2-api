const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    code: {type: String, required: true, maxLength: 64, unique: true},
    name: {type: String, required: true, maxLength: 255},
    icon: {type: String}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

