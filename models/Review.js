// Model של ביקורת: שומר ציון וטקסט שמשתמש כתב על תוכן מסוים.
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    },
    rating: {
        type: Number,
        required: false,
        min: 1,
        max: 10
    },
    text: {
        type: String,
        required: false,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
