const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    rating: {type: Number, required: true},
    email: {
        type: String, 
        validate: {
            validator: function(v) {
              var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
              return emailRegex.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: [true, 'User email required'], 
        maxLength: 100
    },
    message: {type: String, required: true, maxLength: 200},
    meta: {
        platform: String
        }
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;


