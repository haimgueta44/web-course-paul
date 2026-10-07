const WatchHistory = require('../models/WatchHistory');

/** 1. הוספה או עדכון של היסטוריית צפייה */
async function updateWatchHistory(req, res) {
    try {
        const contentId = req.params.contentId;
        const {stoppedAt } = req.body;
        const userId = req.session.profileId; // בהנחה שיש לך Middleware של אימות (Auth) שמזריק את המשתמש

        if (!contentId) {
            return res.status(400).json({ message: 'Content ID is required' });
        }


        console.log(`Updating watch history for user ${userId} and content ${contentId} with stoppedAt: ${stoppedAt}`);
        // upsert: אם הרשומה קיימת היא תתעדכן (זמן הצפייה והעצירה), אם לא - תיווצר חדשה
        const history = await WatchHistory.findOneAndUpdate(
            { profile: userId, content: contentId },
            { 
                watchedAt: new Date(), 
                stoppedAt: stoppedAt || 0 
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(history);
    } catch (error) {
        console.error('Error updating watch history:', error);
        res.status(500).json({ message: 'שגיאה בעדכון היסטוריית הצפייה', error: error.message });
    }
}

/** 2. שליפת היסטוריית הצפייה של המשתמש המחובר */
async function getUserWatchHistory(req, res) {
    try {
        const userId = req.session.profileId; // בהנחה שיש לך Middleware של אימות (Auth) שמזריק את המשתמש

        const history = await WatchHistory.find({ profile: userId })
            .populate('content') // מושך אוטומטית את כל נתוני הסרט (כותרת, תמונה וכו') מה-Schema של התוכן
            .sort({ watchedAt: -1 }); // מיון מהחדש ביותר לישן ביותר

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בקבלת היסטוריית הצפייה', error: error.message });
    }
}

module.exports = {
    updateWatchHistory,
    getUserWatchHistory
};
