const express = require('express');
const router = express.Router();
const { updateWatchHistory, getUserWatchHistory } = require('../controllers/watchHistoryController');
const { requireAuth } = require('../middleware/authMiddleware');
// כל הנתיבים כאן דורשים משתמש מחובר
router.use(requireAuth);

router.post('/:contentId', updateWatchHistory); // לשמירה/עדכון (ייקרא בכל פעם שסוגרים נגן או כל X דקות)
router.get('/', getUserWatchHistory); // לשליפת ההיסטוריה לעמוד הבית

module.exports = router;
