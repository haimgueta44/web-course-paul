let currentPage = 1;
let totalPages = 1;

let searchQuery = '';
let selectedRole = ''; // סינון לפי הרשאה

// פונקציה לטעינת כל הפרופילים מהשרת עם פילטרים ודפדוף
async function loadProfiles() {
    // בניית ה-URL בהתאם לפרמטרים והחיפוש (שם, מייל, הרשאה)
    const url = `/api/profile`;

    // const url = `/api/profiles?page=${currentPage}` +
    //             `&search=${encodeURIComponent(searchQuery)}` +
    //             `&role=${selectedRole}`;

    console.log("Loading profiles from URL:", url);

    const profileList = document.getElementById('profile-list');

    try {
        profileList.innerHTML = '';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        console.log("Profiles received from server:", data);
        
        // אם אין תוצאות
        if (!data || data.length === 0) {
            profileList.innerHTML = '<p class="no-results" style="grid-column: 1/-1; text-align: center; padding: 20px; color: #aaa;">לא נמצאו פרופילים מתאימים.</p>';
            document.getElementById('page-info').innerText = `עמוד 0 מתוך 0`;
            document.getElementById('prev-btn').disabled = true;
            document.getElementById('next-btn').disabled = true;
            return;
        }

        // מיפוי ובניית ה-HTML לכל כרטיסיית פרופיל
        const profilesHTML = data.map(profile => {
            const encodedProfile = encodeURIComponent(JSON.stringify(profile));
            const roleClass = profile.role === 'admin' ? 'role-admin' : 'role-user';
            const roleText = profile.role === 'admin' ? '🛡️ Admin' : '👤 User';
            
            // שימוש באוואטר רנדומלי קבוע לפי השם או אוואטר דיפולטיבי של נטפליקס
            // const avatarUrl = profile.imageUrl || 'https://wikimedia.org';

            // <div class="profile-avatar-wrapper">
            //             <img src="${avatarUrl}" alt="${profile.name}">
            //         </div>

            return `
                <div class="profile-card">
                    
                    <h4 class="profile-name">${profile.name}</h4>
                    <p class="profile-email">${profile.email}</p>
                    <span class="role-badge ${roleClass}">${roleText}</span>
                    
                    <div class="profile-card-buttons">
                        <button type="button" id="edit-btn" class="edit-btn" style="background-color: #0acf45;" data-profile="${encodedProfile}">✏️ ערוך</button>
                        <button type="button" id="delete-btn" class="delete-btn" style="background-color: #bd0f0f;" data-profile="${encodedProfile}">🗑️ מחק</button>
                    </div>
                </div>
            `;
        }).join('');

        // הזרקת הכרטיסיות למיכל בעמוד
        profileList.innerHTML = profilesHTML;

        // עדכון משתני הניווט מהשרת
        totalPages = data.totalPages || 1;
        document.getElementById('page-info').innerText = `${currentPage}/${totalPages}`;

        // נטרול/הפעלת כפתורי דפדוף
        document.getElementById('prev-btn').disabled = (currentPage === 1);
        document.getElementById('next-btn').disabled = (currentPage === totalPages);

    } catch (error) {
        console.error('שגיאה בטעינת הפרופילים:', error);
    }
}

// קריאה ראשונית לטעינת הנתונים
loadProfiles();

// פונקציית שינוי עמוד בדפדוף
function changePage(direction) {
    currentPage += direction;
    loadProfiles();
}

// מאזין אירועים לשורת החיפוש (בזמן אמת)
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1; // איפוס עמוד
    loadProfiles();
});

// מאזין אירועים לסינון לפי תפקיד/הרשאה
document.getElementById('role-filter').addEventListener('change', (e) => {
    selectedRole = e.target.value;
    currentPage = 1;
    loadProfiles();
});

// פונקציה לאיפוס הטופס ומצב עבודה
function resetForm() {
    document.getElementById('profile-form').reset();
    document.getElementById('profile-id').value = '';
    
    // החזרת כפתורים וכותרות למצב הוספה
    document.getElementById('form-title').innerText = '➕ הוספת פרופיל חדש';
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('okUpdate-btn').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
}

// כפתור ביטול עריכה
document.getElementById('cancel-btn').addEventListener('click', resetForm);

// שליחת טופס: הוספת פרופיל חדש (POST)
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const profileData = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        role: document.getElementById('role-select').value,
        password: document.getElementById('password-input').value
    };

    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            alert('הפרופיל נוסף בהצלחה למערכת!');
            resetForm();
            loadProfiles();
        } else {
            alert('השליחה נכשלה. ודא כי כל השדות תקינים והאימייל ייחודי.');
        }
    } catch (error) {
        console.error('שגיאה בתקשורת עם השרת:', error);
        alert('בעיית תקשורת עם השרת.');
    }
});

// משתנה גלובלי זמני לאחסון הפרופיל הנבחר לעריכה
let selectedProfileObj = null;

// מאזין אירועים מבוסס Event Delegation ללחיצות בתוך מיכל האדמין (מחיקה ועריכה)
document.getElementById('admin-main').addEventListener('click', async (event) => {
    
    // מחיקת פרופיל
    if (event.target.classList.contains('delete-btn')) {
        selectedProfileObj = JSON.parse(decodeURIComponent(event.target.getAttribute('data-profile')));
        const profileId = selectedProfileObj._id;
        const profileName = selectedProfileObj.name;

        if (!confirm(`האם אתה בטוח שברצונך למחוק את הפרופיל של: ${profileName}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/profiles/${profileId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('הפרופיל נמחק בהצלחה.');
                loadProfiles();
            } else {
                alert('המחיקה נכשלה. אנא נסה שוב מאוחר יותר.');
            }
        } catch (error) {
            console.error('שגיאה במחיקת הפרופיל:', error);
            alert('בעיית תקשורת עם השרת במחיקה.');
        }
    }
    
    // מעבר למצב עריכת פרופיל
    else if (event.target.classList.contains('edit-btn')) {
        selectedProfileObj = JSON.parse(decodeURIComponent(event.target.getAttribute('data-profile')));
        
        // קריאה לפונקציית ההכנה לעריכה
        startEditing(selectedProfileObj);
    }
});

// פונקציה שממלאת את הטופס בנתוני הפרופיל הקיים וגוללת למעלה
function startEditing(profile) {
    document.getElementById('profile-id').value = profile._id;
    document.getElementById('name-input').value = profile.name;
    document.getElementById('email-input').value = profile.email;
    document.getElementById('role-select').value = profile.role;

    // שינוי תצוגת הכפתורים והכותרת למצב עריכה
    document.getElementById('form-title').innerText = '✏️ עריכת נתוני פרופיל';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('okUpdate-btn').style.display = 'inline-block';
    document.getElementById('cancel-btn').style.display = 'inline-block';

    // גלילה חלקה ומדויקת אל מיקום הטופס למעלה
    document.getElementById('profile-form').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// שליחת בקשת עדכון לשרת (PUT) בלחיצה על כפתור ה-Update המעוצב
document.getElementById('okUpdate-btn').addEventListener('click', async () => {
    if (!selectedProfileObj) return;

    const profileId = document.getElementById('profile-id').value;
    const updatedData = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        role: document.getElementById('role-select').value
    };

    if (!confirm(`האם לעדכן את השינויים עבור הפרופיל?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/profiles/${profileId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('הפרופיל עודכן בהצלחה.');
            resetForm();
            loadProfiles();
        } else {
            alert('העדכון נכשל. אנא בדוק את תקינות הנתונים.');
        }
    } catch (error) {
        console.error('שגיאה בעดכון הפרופיל:', error);
        alert('בעיית תקשורת עם השרת בעדכון.');
    }
});
