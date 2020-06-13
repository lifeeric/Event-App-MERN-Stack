const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const eventSchema = new Schema ({
    title: { type: String, required: true},
    description: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Events', eventSchema);