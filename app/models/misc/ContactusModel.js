const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactUSSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 64},
    lastName: {type: String, required: true, maxLength: 64},
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
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /^\d{10}$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    message: {type: String, required: true, maxLength: 100},
    meta: {
        platform: String
        }
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
});

const ContactUS = mongoose.model('ContactUS', contactUSSchema);
module.exports = ContactUS;


