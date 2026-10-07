// Controller של אימות משתמשים: הרשמה, התחברות, התנתקות וקבלת המשתמש המחובר.
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');

/** מאמתת נתוני הרשמה, מצפינה סיסמה, יוצרת משתמש ופותחת עבורו Session. */
async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'יש למלא את כל השדות.' });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({ message: 'שם המשתמש חייב להכיל לפחות 3 תווים.' });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'כתובת האימייל אינה תקינה.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים.' });
        }

        const existingUser = await User.findOne({
             email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({ message: ' האימייל כבר קיים.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // const userCount = await User.countDocuments();
        console.log("=== מנסה ליצור משתמש ===");
        const user = await User.create({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            // role: userCount === 0 ? 'admin' : 'user'
        });
        console.log("✅ משתמש נוצר בהצלחה עם ID:", user._id);


        console.log("=== מנסה ליצור פרופיל ===");
        const profile = await Profile.create({
            user: user._id,
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'owner',
            favoriteCategories: []
        });
        console.log("✅ פרופיל נוצר בהצלחה עם ID:", profile._id);

        req.session.profileId = profile._id;
        req.session.name = profile.name; // שמירת מזהה המשתמש ב-Session
        req.session.role = profile.role;
        req.session.user = profile.user;

        res.status(201).json({
            profileId: profile._id,
            name: profile.name,
            email: profile.email,
            role: profile.role
        });
    } catch (error) {
        res.status(500).json({ message: 'ההרשמה נכשלה.' });
    }
}

/** בודקת אימייל וסיסמה מול MongoDB ויוצרת Session כאשר הפרטים נכונים. */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        console.log("  === מנסה להתחבר ===  "+email+" | "+password);
        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ message: 'יש למלא אימייל וסיסמה.' });
        }

        const profile = await Profile.findOne({ email: email.toLowerCase() });

        if (!profile || !await bcrypt.compare(password, profile.password)) {
            return res.status(401).json({ message: 'האימייל או הסיסמה שגויים.' });
        }

        req.session.profileId = profile._id;
        req.session.name = profile.name; // שמירת מזהה המשתמש ב-Session
        req.session.role = profile.role;
        req.session.user = profile.user;
        // req.session.email = profile.email;

        console.log("✅ התחברות בוצעה בהצלחה, Session נוצר עם מזהה פרופיל:", profile._id);
        console.log("=== ה-Session הנוכחי בשרת ===");
        console.log(req.session);

        res.json({
            profileId: profile._id,
            name: profile.name,
            email: profile.email,
            role: profile.role
        });
    } catch (error) {
        res.status(500).json({ message: 'ההתחברות נכשלה.' });
    }
}

/** מוחקת את ה-Session הפעיל ומחזירה הודעת הצלחה או שגיאה. */
function logout(req, res) {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).json({ message: 'ההתנתקות נכשלה.' });
        }
        res.clearCookie('connect.sid'); // מחיקת העוגייה מהדפדפן

        console.log("✅ Session נמחק בהצלחה, המשתמש התנתק.");
        
        // console.log("=== ה-Session הנוכחי בשרת ===");
        // console.log(req.session);

        res.json({ message: 'ההתנתקות בוצעה בהצלחה.' });

        
    });
}

/** מחזירה את שם המשתמש, האימייל והתפקיד של המשתמש המזוהה ב-Session. */
async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.session.userId).select('username email role');

        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את המשתמש.' });
    }
}

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};
