// Model של היסטוריית צפייה: מתעד איזה פרופיל צפה באיזה תוכן ואת מצב ההתקדמות.
const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
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
    watchedAt: {
        type: Date,
        default: Date.now // זמן הצפייה האחרון
    },
    stoppedAt: {
        type: Number,
        default: 0 // שמירת זמן העצירה בשניות (למשל: עצר בדקה 14:20 -> 860 שניות)
    }
}, { timestamps: true });

watchHistorySchema.index({ profile: 1, content: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
