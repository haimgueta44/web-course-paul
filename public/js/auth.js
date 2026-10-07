// ניהול מעבר בין לשוניות הרשמה והתחברות
// const session = require('express-session');


document.addEventListener("DOMContentLoaded", () => {
    // הצגת קישורים למנהל בלבד
const profileRole = sessionStorage.getItem('profileRole');
    if (profileRole === 'admin') {
        const adminLinks = document.querySelectorAll('.admin-only');
        adminLinks.forEach(link => {
            link.style.display = 'inline-block'; // או 'block' בהתאם לעיצוב ה-CSS שלך
        });
    }
    else if (profileRole === 'owner') {
    // התיקון כאן: מורידים את הנקודה!
    const profileLink = document.getElementById('manage-profiles-link');
    if (profileLink) {
        profileLink.style.display = 'inline-block';
    }
    }

// הצגת שם המשתמש בבר העליון
const profileName = document.getElementById('profile-name');
if(profileName){
    if (profileRole === 'admin') {
        profileName.textContent = sessionStorage.getItem('profileName').trim().split(' ')[0]+ ' (מנהל אתר)' || 'משתמש אנונימי';
    }
    else if (profileRole === 'owner') {
        profileName.textContent = sessionStorage.getItem('profileName').trim().split(' ')[0]+ ' (בעל המנוי)' || 'משתמש אנונימי';
    }
    else {
        profileName.textContent = sessionStorage.getItem('profileName').trim().split(' ')[0]+ ' (פרופיל רגיל )' || 'משתמש אנונימי';
    }
}
});



const loginTab = document.getElementById('showLoginTab');
const registerTab = document.getElementById('showRegisterTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const messageBox = document.getElementById('messageBox');
const logoutLink = document.getElementById('logout-link');

if(loginTab){
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        messageBox.style.display = 'none';
    });
}

if(registerTab){
    registerTab.addEventListener('click', () => {
        // console.log("registerTab clicked");
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        messageBox.style.display = 'none';
    });
}


//טיפול בהרשמה
if (registerForm) {
    registerForm.addEventListener('submit', async event => {
        event.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            sessionStorage.setItem('profileName', result.name);
            sessionStorage.setItem('profileRole', result.role);
            sessionStorage.setItem('profileId', result.profileId);
            sessionStorage.setItem('profileEmail', result.email);
            // if (result.role === 'admin') {
            // window.location.href = '/admin-dashboard';
            // }
            // else{
            await fetchWatchHistory();
            
            window.location.href = '/feed';
            // }
        } catch (error) {
            console.error('שגיאה בהרשמה :', error);
        }
    });
}

// מאזין לטופס ההתחברות ושולח את הנתונים ללא רענון מלא של הדף.
if (loginForm) {
    loginForm.addEventListener('submit', async event => {
        event.preventDefault();
        // console.log(document.getElementById('email').value);
        const data = {
            email: document.getElementById('loginEmail').value.trim(),
            password: document.getElementById('loginPassword').value
        };
        console.log("=== מנסה להתחבר ===" + JSON.stringify(data));
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }
            console.log("✅ התחברות בוצעה בהצלחה. המשתמש הוא:", result.name, "והתפקיד הוא:", result.role);
            console.log("✅ התחברות בוצעה בהצלחה. המשתמש הוא:", result);
            sessionStorage.setItem('profileName', result.name);
            sessionStorage.setItem('profileRole', result.role);
            sessionStorage.setItem('profileId', result.profileId);
            sessionStorage.setItem('profileEmail', result.email);

            // await fetchWatchHistory();

            if (result.role === 'admin') {
            window.location.href = '/admin';
            }
            else{
            window.location.href = '/feed';
            }
        } catch (error) {
            console.error('שגיאה בהתחברות :', error);
        }
    });
}

// /טיפול בהתנתקות
if (logoutLink) {
    logoutLink.addEventListener('click', async (event) => {
        event.preventDefault(); // עוצר את המעבר האוטומטי של הקישור ל-#

        console.log("=== מנסה להתנתק ===");
        try {
            // שליחת בקשת POST מאובטחת לשרת לביצוע התנתקות
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                sessionStorage.removeItem('profileName');
                sessionStorage.removeItem('profileRole');
                sessionStorage.removeItem('profileId');
                sessionStorage.removeItem('profileEmail');
                console.log("✅ התנתקות מהשרת בוצעה בהצלחה.");
                // אם ההתנתקות הצליחה בשרת, נעביר את המשתמש לעמוד ההתחברות
                window.location.href = '/'; // או הכתובת של עמוד הבית שלך
            } else {
                alert('שגיאה בהתנתקות מהמערכת');
            }
        } catch (error) {
            console.error('שגיאת רשת:', error);
        }
    });
}

// async function fetchWatchHistory() {
//     try {
//         const response = await fetch('/api/watch-history', {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' }
//         });
//         const history = await response.json();
//         // console.log("✅ היסטוריית צפייה:", history[0]);
//         console.log("✅ היסטוריית צפייה: " + JSON.stringify(history, null, 2));
//     } catch (error) {
//         console.error('שגיאה בFetchRequest היסטוריית צפייה:', error);
//     }
// }