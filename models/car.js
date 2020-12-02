const mongoose = require('mongoose');
const validator = require('validator');

const carSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        available: {
            type: Boolean,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        bookingHours: {
            type: Number
        }
    },

    {
        timestamps: {
            updatedAt: 'bookedAt'
        }
    })

const Car = mongoose.model('Car', carSchema)

module.exports = Car;