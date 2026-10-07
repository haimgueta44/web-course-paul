// Routes של פרופילים: CRUD וחיפוש עבור פרופילי המשתמש המחובר.
const express = require('express');
const {
    getAllProfiles,
    createProfileByUser,
    // searchProfiles,
    // createProfileByUser,
    updateProfile,
    // deleteProfile,
    // searchProfilesToUser,
    // getAllProfilesToUser
} = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// כל הנתיבים בקובץ דורשים Session פעיל.
router.use(requireAuth);
// מיפוי פעולות הרשימה, החיפוש וה-CRUD לפונקציות ה-Controller.
router.get('/', getAllProfiles);
// router.get('/search', searchProfiles);
// router.post('/', createProfile);
router.post('/', createProfileByUser);
router.put('/', updateProfile);
// router.delete('/:id', deleteProfile);

module.exports = router;
