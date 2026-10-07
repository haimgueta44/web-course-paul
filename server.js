// 1. טוען את המידע הסודי מקובץ ה-.env שיצרנו
require('dotenv').config(); 
const express = require('express');
// 2. ייבוא ספריית Mongoose לניהול מסד הנתונים
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const externalRoutes = require('./routes/externalRoutes');
const watchHistoryRoutes = require('./routes/watchHistoryRoutes');
const { requirePageAuth, requirePageAdmin, requireAdmin, requireAdminOrOwner, requireAuth } = require('./middleware/authMiddleware');



const app = express();
const PORT = 3000;

app.use(session({
    secret: 'mySuperSecretKey123', // מפתח סודי המשמש להצפנת ה-Session ID בעוגייה
    resave: false,                 // מונע שמירה מחדש של הסשן בשרת אם הוא לא השתנה
    saveUninitialized: false,      // מונע יצירת סשן ריק למשתמשים שעדיין לא התחברו
    cookie: { 
        secure: false,             // שנה ל-true אם האתר שלך עובד עם HTTPS
        maxAge: 1000 * 60 * 60 * 24 // תוקף העוגייה (למשל: יממה אחת במילישניות)
    }
}));

// 3. הגדרה שמאפשרת לשרת שלנו לקרוא מידע שמגיע בפורמט JSON (למשל מטפסי הרשמה)
app.use(express.json());

// 1. הגדרה שמאפשרת לשרת להגיש קבצי עיצוב, תמונות וקוד לקוח מתיקיית public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/api/contents', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/watch-history', watchHistoryRoutes);

// 4. ניסיון חיבור למסד הנתונים MongoDB (מתחבר תמיד, אלא אם מדובר בטסטים של Jest)
if (!process.env.JEST_WORKER_ID) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB successfully!');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
}

// הגדרת האזנה לשרת (נפתח תמיד, אלא אם מדובר בטסטים של Jest)
if (!process.env.JEST_WORKER_ID) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}


// 3. הגדרת הנתיבים הראשיים שמחזירים דפי HTML לדפדפן
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});    

// נתיב לעמוד הפיד האישי
app.get('/feed', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'feed.html'));
});

// נתיב לעמוד דף הסטטיסטיקות
app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stats.html'));
});

app.get('/infoContent', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'infoContent.html'));
});

app.get('/profilesmanage',requireAdminOrOwner, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profilesmanage.html'));
});

app.get('/contents', requirePageAuth, (req, res) => {
    const filePath = path.join(__dirname, 'views', 'contents.html');
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("❌ שגיאה בטעינת הקובץ! הנתיב שהשרת חיפש הוא:");
            console.log(filePath);
            res.status(404).send("הקובץ לא נמצא בנתיב המבוקש.");
        }
    });
});


// נתיב לעמוד דף השירותים החיצוניים והמפה
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

// נתיב לעמוד דף האדמין
app.get('/admin',requirePageAdmin, (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));

// נתיב לעמוד דף בחירת פרופיל
// app.get('/choose-profile', (req, res) => res.sendFile(path.join(__dirname, 'views', 'choose-profile.html')));

// נתיב לעמוד דף היסטוריית הצפייה
app.get('/watch-history', (req, res) => res.sendFile(path.join(__dirname, 'views', 'watch-history.html')));

//נתיב לעמוד עריכת פרופיל
app.get('/edit-profile', requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'views', 'editProfile.html')));




// חשוב: לייצא את app כדי ש-supertest יוכל להשתמש בו!
module.exports = app;