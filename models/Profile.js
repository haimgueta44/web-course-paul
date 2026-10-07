// Model של פרופיל צפייה: כל פרופיל שייך למשתמש ושומר גיל וקטגוריות מועדפות.
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    // age: {
    //     type: Number,
    //     required: true,
    //     min: 1,
    //     max: 120
    // },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['profile', 'admin','owner'],
        default: 'profile'
    },
    favoriteCategories: [{
        type: String,
        trim: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
