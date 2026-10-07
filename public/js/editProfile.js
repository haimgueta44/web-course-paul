

// // משתנה גלובלי זמני לאחסון הפרופיל הנבחר לעריכה
// let selectedProfileObj = null;

// // מאזין אירועים מבוסס Event Delegation ללחיצות בתוך מיכל האדמין (מחיקה ועריכה)
// document.getElementById('admin-main').addEventListener('click', async (event) => {
    
//     // מחיקת פרופיל
//     if (event.target.classList.contains('delete-btn')) {
//         selectedProfileObj = JSON.parse(decodeURIComponent(event.target.getAttribute('data-profile')));
//         const profileId = selectedProfileObj._id;
//         const profileName = selectedProfileObj.name;

//         if (!confirm(`האם אתה בטוח שברצונך למחוק את הפרופיל של: ${profileName}?`)) {
//             return;
//         }

//         try {
//             const response = await fetch(`/api/profiles/${profileId}`, {
//                 method: 'DELETE'
//             });

//             if (response.ok) {
//                 alert('הפרופיל נמחק בהצלחה.');
//                 loadProfiles();
//             } else {
//                 alert('המחיקה נכשלה. אנא נסה שוב מאוחר יותר.');
//             }
//         } catch (error) {
//             console.error('שגיאה במחיקת הפרופיל:', error);
//             alert('בעיית תקשורת עם השרת במחיקה.');
//         }
//     }
    
//     // מעבר למצב עריכת פרופיל
//     else if (event.target.classList.contains('edit-btn')) {
//         selectedProfileObj = JSON.parse(decodeURIComponent(event.target.getAttribute('data-profile')));
        
//         // קריאה לפונקציית ההכנה לעריכה
//         startEditing(selectedProfileObj);
//     }
// });

// פונקציה שממלאת את הטופס בנתוני הפרופיל הקיים וגוללת למעלה
function startEditing() {
    document.getElementById('profile-id').value = sessionStorage.getItem('profileId'); // שמירת ה-ID של הפרופיל הנבחר לעריכה
    document.getElementById('name-input').value = sessionStorage.getItem('profileName');
    document.getElementById('email-input').value = sessionStorage.getItem('profileEmail');

    // // שינוי תצוגת הכפתורים והכותרת למצב עריכה
    // document.getElementById('form-title').innerText = '✏️ עריכת נתוני פרופיל';
    // document.getElementById('submit-btn').style.display = 'none';
    // document.getElementById('okUpdate-btn').style.display = 'inline-block';
    // document.getElementById('cancel-btn').style.display = 'inline-block';

    // // גלילה חלקה ומדויקת אל מיקום הטופס למעלה
    // document.getElementById('profile-form').scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'start'
    // });
}
startEditing();

// שליחת בקשת עדכון לשרת (PUT) בלחיצה על כפתור ה-Update המעוצב
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // if (!selectedProfileObj) return;

    const profileId = document.getElementById('profile-id').value;
    const updatedData = {
        id: profileId,
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value
    };

    console.log("=== נתוני עדכון פרופיל ===", updatedData);
    if (!confirm(`האם לעדכן את השינויים עבור הפרופיל?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('הפרופיל עודכן בהצלחה.');
            // resetForm();
            // loadProfiles();
            window.location.href = '/feed'; // הפניה מחדש לעמוד בחירת פרופיל לאחר עדכון
        } else {
            alert('העדכון נכשל. אנא בדוק את תקינות הנתונים.');
        }
    } catch (error) {
        console.error('שגיאה בעดכון הפרופיל:', error);
        alert('בעיית תקשורת עם השרת בעדכון.');
    }
});
