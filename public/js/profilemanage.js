// קוד מסך הקטלוג: מציג, מחפש ומנהל CRUD של תכנים בהתאם להרשאת המשתמש.

/** טוענת תכנים מהכתובת שנשלחה ובונה את כרטיסי הקטלוג; ברירת המחדל היא כל התכנים. */
// async function loadContents(url = '/api/contents') {
//     console.log("Loading contents from URL:", url); // Debugging line

//     // const message = document.getElementById('message');
//     const contentList = document.getElementById('content-list');

//     try {
//         contentList.innerHTML = '';
//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error();
//         }

//         const contents = await response.json();

//         const moviesHTML = contents.map(movie => {
//             return `
//                 <div class="content-card">
//                     <div class="poster-wrapper">
//                         <img src="${movie.imageUrl}" alt="${movie.title}">
//                         <div class="rating-badge">⭐ ${movie.rating}</div>
//                     </div>
//                     <div class="card-details">
//                         <span class="category-tag">${movie.category}</span>
//                         <h4 class="content-title">${movie.title}</h4>
//                         <p class="release-year">שנת יציאה: ${movie.releaseYear}</p>
//                     </div>
//                 </div>
//             `;
//         }).join(''); // מחבר את כל ה-HTML למחרוזת אחת גדולה

//         // 3. הזרקת ה-HTML הדינמי לתוך המיכל בעמוד
//         contentList.innerHTML = moviesHTML;

//     //     if (contents.length === 0) {
//     //         message.textContent = url.includes('/search')
//     //             ? 'לא נמצאו תכנים מתאימים.'
//     //             : 'עדיין אין תכנים בקטלוג.';
//     //         return;
//     //     }

//     //     message.textContent = '';

//     //     contents.forEach(content => {
//     //         const card = document.createElement('article');
//     //         card.className = 'content-card';

//     //         const image = document.createElement('img');
//     //         image.src = content.imageUrl;
//     //         image.alt = content.title;

//     //         const title = document.createElement('h2');
//     //         title.textContent = content.title;

//     //         const details = document.createElement('p');
//     //         details.textContent = `${content.category} | ${content.releaseYear} | ${content.rating}/10`;

//     //         const description = document.createElement('p');
//     //         description.className = 'content-description';
//     //         description.textContent = content.description;

//     //         const trailerLink = document.createElement('a');
//     //         trailerLink.className = 'trailer-link';
//     //         trailerLink.href = content.videoUrl;
//     //         trailerLink.target = '_blank';
//     //         trailerLink.rel = 'noopener noreferrer';
//     //         trailerLink.textContent = 'צפייה בטריילר';

//     //         const editButton = document.createElement('button');
//     //         editButton.className = 'edit-button';
//     //         editButton.textContent = 'עריכה';

//     //         // לחיצה על עריכה מעתיקה את נתוני הכרטיס לטופס.
//     //         editButton.addEventListener('click', () => {
//     //             startEditing(content);
//     //         });

//     //         const deleteButton = document.createElement('button');
//     //         deleteButton.className = 'delete-button';
//     //         deleteButton.textContent = 'מחיקה';

//     //         // לחיצה על מחיקה מבקשת אישור ושולחת DELETE לשרת.
//     //         deleteButton.addEventListener('click', async () => {
//     //             if (!confirm('האם למחוק את התוכן?')) {
//     //                 return;
//     //             }

//     //             try {
//     //                 const response = await fetch(`/api/contents/${content._id}`, {
//     //                     method: 'DELETE'
//     //                 });

//     //                 if (!response.ok) {
//     //                     throw new Error();
//     //                 }

//     //                 await loadContents();
//     //                 message.textContent = 'התוכן נמחק בהצלחה.';
//     //             } catch (error) {
//     //                 message.textContent = 'לא ניתן למחוק את התוכן.';
//     //             }
//     //         });

//     //         card.append(image, title, details, description, trailerLink);

//     //         if (currentUserRole === 'admin') {
//     //             card.append(editButton, deleteButton);
//     //         }

//     //         contentList.appendChild(card);
//     //     });
//     console.log("Contents loaded successfully:", contents); // Debugging line
//     } catch (error) {
//         message.textContent = 'לא ניתן לטעון את התכנים.';
//     }
// }
// loadContents();

// const contentForm = document.getElementById('content-form');
// const contentManagement = document.getElementById('content-management');
// const searchForm = document.getElementById('search-form');
// const searchTitle = document.getElementById('search-title');
// const clearSearchButton = document.getElementById('clear-search-button');
// const formTitle = document.getElementById('form-title');
// const submitButton = document.getElementById('submit-button');
// const cancelEditButton = document.getElementById('cancel-edit-button');
// let editingContentId = null;
// let currentUserRole = null;

// /** טוענת את הרשאת המשתמש ומציגה את טופס ניהול התוכן רק למנהל. */
// async function loadCurrentUser() {
//     const response = await fetch('/api/auth/me');

//     if (response.ok) {
//         const user = await response.json();
//         currentUserRole = user.role;
//         contentManagement.hidden = user.role !== 'admin';
//     }
// }

// /** מעבירה את טופס התוכן למצב עריכה וממלאת אותו בנתוני הכרטיס שנבחר. */
// function startEditing(content) {
//     editingContentId = content._id;
//     document.getElementById('title').value = content.title;
//     document.getElementById('description').value = content.description;
//     document.getElementById('category').value = content.category;
//     document.getElementById('type').value = content.type;
//     document.getElementById('releaseYear').value = content.releaseYear;
//     document.getElementById('rating').value = content.rating;
//     document.getElementById('videoUrl').value = content.videoUrl;
//     document.getElementById('imageUrl').value = content.imageUrl;
//     document.getElementById('address').value = content.address || '';

//     formTitle.textContent = 'עריכת תוכן';
//     submitButton.textContent = 'שמירת שינויים';
//     cancelEditButton.hidden = false;
//     contentForm.scrollIntoView({ behavior: 'smooth' });
// }

// /** מסיימת מצב עריכה, מאפסת את הטופס ומחזירה אותו למצב הוספה. */
// function stopEditing() {
//     editingContentId = null;
//     contentForm.reset();
//     formTitle.textContent = 'הוספת תוכן';
//     submitButton.textContent = 'הוספה';
//     cancelEditButton.hidden = true;
// }

// // ביטול מחזיר את טופס התוכן למצב הוספה.
// cancelEditButton.addEventListener('click', stopEditing);

// // שליחת טופס החיפוש טוענת תכנים לפי שם ללא רענון הדף.
// searchForm.addEventListener('submit', event => {
//     event.preventDefault();
//     const title = searchTitle.value.trim();

//     if (title) {
//         loadContents(`/api/contents/search?title=${encodeURIComponent(title)}`);
//     }
// });

// // ניקוי החיפוש מחזיר את כל תכני הקטלוג.
// clearSearchButton.addEventListener('click', () => {
//     searchForm.reset();
//     loadContents();
// });

// // אותו טופס שולח POST בהוספה או PUT כאשר קיים id לעריכה.
// contentForm.addEventListener('submit', async event => {
//     event.preventDefault();

//     const formMessage = document.getElementById('form-message');
//     const content = {
//         title: document.getElementById('title').value,
//         description: document.getElementById('description').value,
//         category: document.getElementById('category').value,
//         type: document.getElementById('type').value,
//         releaseYear: Number(document.getElementById('releaseYear').value),
//         rating: Number(document.getElementById('rating').value) || 0,
//         videoUrl: document.getElementById('videoUrl').value,
//         imageUrl: document.getElementById('imageUrl').value,
//         address: document.getElementById('address').value
//     };

//     try {
//         const url = editingContentId ? `/api/contents/${editingContentId}` : '/api/contents';
//         const method = editingContentId ? 'PUT' : 'POST';
//         const successMessage = editingContentId ? 'התוכן עודכן בהצלחה.' : 'התוכן נוסף בהצלחה.';

//         const response = await fetch(url, {
//             method,
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(content)
//         });

//         if (!response.ok) {
//             throw new Error();
//         }

//         stopEditing();
//         formMessage.textContent = successMessage;
//         await loadContents();
//     } catch (error) {
//         formMessage.textContent = editingContentId
//             ? 'לא ניתן לעדכן את התוכן.'
//             : 'לא ניתן להוסיף את התוכן.';
//     }
// });

// loadCurrentUser().finally(loadContents);
// חילוץ שם המשתמש



let currentPage = 1;
let totalPages = 1;

let searchQuery = '';
let selectedCategory = ''; // משתנה חדש לקטגוריה
let selectedSort = 'rating_desc'; // משתנה חדש למיון (ברירת מחדל: ציון גבוה)

// url = `/api/contents?page=${currentPage}`
async function loadContents() {
    const url = `/api/contents?page=${currentPage}` +
                    `&search=${encodeURIComponent(searchQuery)}` +
                    `&category=${encodeURIComponent(selectedCategory)}` +
                    `&sort=${selectedSort}`;

    console.log("Loading contents from URL:", url); // Debugging line

    // const message = document.getElementById('message');
    const contentList = document.getElementById('content-list');

    try {
        contentList.innerHTML = '';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const contents = await response.json();
        console.log("Contents received from server:", contents); // Debugging line


        if (contents.contents.length === 0) {
            contentList.innerHTML = '<p class="no-results">לא נמצאו תוצאות מתאימות.</p>';
            document.getElementById('page-info').innerText = `עמוד 0 מתוך 0`;
            document.getElementById('prev-btn').disabled = true;
            document.getElementById('next-btn').disabled = true;
            return;
        }


        const moviesHTML = contents.contents.map(movie => {
            const encodedMovie = encodeURIComponent(JSON.stringify(movie));
            return `
                <a class="content-card-link">
                    <div class="content-card" id="content-card">
                        <div class="poster-wrapper">
                            <img src="${movie.imageUrl}" alt="${movie.title}">
                            <div class="rating-badge">⭐ ${movie.rating}</div>
                        </div>
                        <div class="card-details">
                            <span class="category-tag">${movie.category}</span>
                            <h4 class="content-title">${movie.title}</h4>
                            <p class="release-year">שנת יציאה: ${movie.releaseYear}</p>
                            <button type="submit" id="delete-btn" class="delete-btn" data-movie="${encodedMovie}">🗑️ מחק תוכן</button>
                            <button type="submit" id="edit-btn" class="edit-btn"" data-movie="${encodedMovie}">✏️ ערוך תוכן</button>
                        </div>
                        

                    </div>
                </a>
            `;
        }).join(''); // מחבר את כל ה-HTML למחרוזת אחת גדולה

        // 3. הזרקת ה-HTML הדינמי לתוך המיכל בעמוד
        contentList.innerHTML = moviesHTML;

        // עדכון משתני הניווט מהשרת
        totalPages = contents.totalPages;
        document.getElementById('page-info').innerText = `${currentPage}/${totalPages}`;

        // נטרול כפתורים אם הגענו לקצה
        document.getElementById('prev-btn').disabled = (currentPage === 1);
        document.getElementById('next-btn').disabled = (currentPage === totalPages);
    
        console.log("Contents loaded successfully:", contents); // Debugging line


    } catch (error) {
        message.textContent = 'לא ניתן לטעון את התכנים.';
    }
}
loadContents();

function changePage(direction) {
    currentPage += direction;
    loadContents(); // טעינת הסרטים מחדש עבור העמוד החדש
}


// מאזיני אירועים לכל האלמנטים
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    currentPage = 1; // מאפסים עמוד בכל שינוי פילטר
    loadContents();
})

document.getElementById('category-filter').addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    currentPage = 1;
    loadContents();
});

document.getElementById('sort-select').addEventListener('change', (e) => {
    selectedSort = e.target.value;
    currentPage = 1;
    loadContents();
});




// פונקציה שמנקה את הטופס ומחזירה אותו למצב "הוספת תוכן חדש"
function resetForm() {
    // 1. איפוס כל השדות בטופס לערכי ברירת המחדל
    document.getElementById('content-form').reset();
    
    // 2. מחיקת ה-ID מהשדה הנסתר (כדי שהשרת ידע שהבקשה הבאה היא יצירה חדשה)
    document.getElementById('movie-id').value = '';
    
    // 3. החזרת הכותרת למצב המקורי
    document.getElementById('form-title').innerText = '➕ הוספת תוכן חדש';
    
    // 4. הסתרת כפתור הביטול (כי אין בעצם מה לבטל כשהטופס ריק)
    document.getElementById('cancel-btn').style.display = 'none';
}

// // חיבור כפתור הביטול ב-HTML לפונקציית האיפוס
// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('cancel-btn').addEventListener('click', resetForm);
// });



//טופס הוספת תוכן
document.getElementById('content-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // 1. עוצר את הדפדפן מלרענן את העמוד כברירת מחדל
    console.log(e.target); // Debugging line
    // 2. כאן הקוד אוסף אוטומטית את הערכים מכל השדות:
    const movieData = {
        title: document.getElementById('title-input').value,
        description: document.getElementById('description-input').value,
        category: document.getElementById('category-select').value,
        type: document.getElementById('type-select').value,
        releaseYear: document.getElementById('releaseYear-input').value,
        rating: document.getElementById('rating-input').value,
        videoUrl: document.getElementById('trailer-input').value,
        imageUrl: document.getElementById('image-input').value,
    };

    console.log("Submitting movie data:", movieData); // Debugging line
    
    try {
        // 2. שליחת המידע לשרת ביצירה חדשה (POST)
        const response = await fetch('/api/contents', {
            method: 'POST', // מציין שמדובר ביצירת משאב חדש
            headers: {
                'Content-Type': 'application/json' // אומר לשרת שאנחנו שולחים מידע בפורמט JSON
            },
            body: JSON.stringify(movieData) // הפיכת אובייקט ה-JavaScript למחרוזת טקסט (String)
        });

        // 3. בדיקה אם השרת קיבל ושמר את המידע בהצלחה
        if (response.ok) {
            alert('התוכן נוסף בהצלחה למסד הנתונים!');
            
            // 4. איפוס וניקוי הטופס אוטומטית
            resetForm(); 
            
            // 5. טעינה מחדש של הקטלוג למטה כדי לראות את הסרט החדש מיידית
            loadContents(); 
        } else {
            alert('השליחה נכשלה. אנא ודא שכל השדות תקינים.');
        }

    } catch (error) {
        console.error('שגיאה בתקשורת עם השרת:', error);
        alert('אופס! קיימת בעיית תקשורת עם השרת.');
    }

});

// async function deleteContent(encodedMovie) {
//     // console.log("Attempting to delete content:", content); // Debugging line
//     const content = JSON.parse(decodeURIComponent(encodedMovie));
//     const contentId = content._id; 
//     const title = content.title; 
//     if (!confirm('האם למחוק את התוכן? ' + title)) {
//             return;
//     }

//     try {
//         // console.log("מנסה למחוק תוכן עם ID:", contentId); // Debugging line
//         const response = await fetch(`/api/contents/${contentId}`, {
//             method: 'DELETE',
//         });

//         if (response.ok) {
//             alert('התוכן נמחק בהצלחה.');
//             loadContents(); // טעינה מחדש של הקטלוג
//         } else {
//             alert('המחיקה נכשלה. אנא נסה שוב.');
//         }
        
//     } catch (error) {
//         console.error('שגיאה במחיקת התוכן:', error);
//         alert('אופס! קיימת בעיית תקשורת עם השרת.');
//     }
// }


let content = null; // משתנה גלובלי לאחסון התוכן הנבחר לעריכה
//מחיקת ועדכון תוכן
document.getElementById('admin-main').addEventListener('click', async (event) => {
    console.log("Admin container clicked:", event.target); // Debugging line
    //מחיקת תוכן
    if (event.target.classList.contains('delete-btn')) {
        // console.log("Delete button clicked"); // Debugging line
        // return; // Exit if the delete button was clicked
    // }

    content = JSON.parse(decodeURIComponent(event.target.getAttribute('data-movie')));
    // console.log("Attempting to delete content:", content); // Debugging line
    const contentId = content._id; 
    const title = content.title; 
    if (!confirm('האם למחוק את התוכן? ' + title)) {
        return;
    }

    try {
        // console.log("מנסה למחוק תוכן עם ID:", contentId); // Debugging line
        const response = await fetch(`/api/contents/${contentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('התוכן נמחק בהצלחה.');
            loadContents(); // טעינה מחדש של הקטלוג
        } else {
            alert('המחיקה נכשלה. אנא נסה שוב.');
        }
        
    } catch (error) {
        console.error('שגיאה במחיקת התוכן:', error);
        alert('אופס! קיימת בעיית תקשורת עם השרת.');
    }
}
    //עדכון תוכן
    else if (event.target.classList.contains('edit-btn')) {
            // console.log("edit button clicked"); // Debugging line
            // return; // Exit if the delete button was clicked
        // }

        content = JSON.parse(decodeURIComponent(event.target.getAttribute('data-movie')));
        // // console.log("Attempting to delete content:", content); // Debugging line
        startEditing(content);
        // const contentId = content._id; 
        // const title = content.title; 
        // if (!confirm('האם למחוק את התוכן? ' + title)) {
        //     return;
        // }

        // const contentData = {
        //     title: content.title,
        //     description: content.description,
        //     category: content.category,
        //     type: content.type,
        //     releaseYear: content.releaseYear,
        //     rating: content.rating,
        //     videoUrl: content.videoUrl,
        //     imageUrl: content.imageUrl,
        // };

        //שליחת הטופס לעדכון בשרת
        // if (event.target.classList.contains('okUpdate-btn')) {
        //     console.log("okUpdate button clicked"); // Debugging line
        //     if (!confirm('האם לעדכן את התוכן? ' + title)) {
        //         return;
        //     }
            // try {
            //     // console.log("מנסה למחוק תוכן עם ID:", contentId); // Debugging line
            //     const response = await fetch(`/api/contents/${contentId}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(contentData)
            //     });

            //     if (response.ok) {
            //         // alert('התוכן עודכן בהצלחה.');
            //         loadContents(); // טעינה מחדש של הקטלוג
            //         // stopEditing();
            //     } else {
            //         alert('העדכון נכשל. אנא נסה שוב.');
            //     }
                
            // } catch (error) {
            //     console.error('שגיאה בעדכון התוכן:', error);
            //     alert('אופס! קיימת בעיית תקשורת עם השרת.');
            // }
        // }
    }
}); 

// שליחת הטופס לעדכון בשרת
const okUpdateButton = document.getElementById('okUpdate-btn');
okUpdateButton.addEventListener('click', async () => {
    console.log("okUpdate button clicked"); // Debugging line

    const contentId = content._id;
    const contentData = {
        title: document.getElementById('title-input').value,
        description: document.getElementById('description-input').value,
        category: document.getElementById('category-select').value,
        type: document.getElementById('type-select').value,
        releaseYear: document.getElementById('releaseYear-input').value,
        rating: document.getElementById('rating-input').value,
        videoUrl: document.getElementById('trailer-input').value,
        imageUrl: document.getElementById('image-input').value,
    };

    try {
        // console.log("מנסה למחוק תוכן עם ID:", contentId); // Debugging line
        const response = await fetch(`/api/contents/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData)
        });

        if (response.ok) {
            alert('התוכן עודכן בהצלחה.');
            // loadContents(); // טעינה מחדש של הקטלוג
            // stopEditing();
            location.reload();
        } else {
            alert('העדכון נכשל. אנא נסה שוב.');
        }
        
        } catch (error) {
            console.error('שגיאה בעדכון התוכן:', error);
            alert('אופס! קיימת בעיית תקשורת עם השרת.');
        }

});

// כפתור ביטול עריכה
const cancelBtn = document.getElementById('cancel-btn');
cancelBtn.addEventListener('click', () => {
    location.reload(); // איפוס הטופס והחזרת המצב למצב הוספה
});


    // async function updateContent(encodedMovie) {
//     // console.log("Attempting to delete content:", content); // Debugging line
//     const content = JSON.parse(decodeURIComponent(encodedMovie));
//     // const contentId = content._id; 
//     // const title = content.title; 

//     startEditing(content)

//     const contentData = {
//         title: content.title,
//         description: content.description,
//         category: content.category,
//         type: content.type,
//         releaseYear: content.releaseYear,
//         rating: content.rating,
//         videoUrl: content.videoUrl,
//         imageUrl: content.imageUrl,
//     };

//     if (!confirm('האם לעדכן את התוכן? ' + content.title)) {
//         return;
//     }

//     try {
//         // // console.log("מנסה למחוק תוכן עם ID:", contentId); // Debugging line
//         // const response = await fetch(`/api/contents/${contentId}`, {
//         //     method: 'DELETE',
//         // });

//         // if (response.ok) {
//         //     alert('התוכן עודכן בהצלחה.');
//         //     loadContents(); // טעינה מחדש של הקטלוג
//         // } else {
//         //     alert('המחיקה נכשלה. אנא נסה שוב.');
//         // }

//     } catch (error) {
//         console.error('שגיאה בעדכון התוכן:', error);
//         alert('אופס! קיימת בעיית תקשורת עם השרת.');
//     }
// }


function startEditing(content) {
    // editingContentId = content._id;
    document.getElementById('title-input').value = content.title;
    document.getElementById('description-input').value = content.description;
    document.getElementById('category-select').value = content.category;
    document.getElementById('type-select').value = content.type;
    document.getElementById('releaseYear-input').value = content.releaseYear;
    document.getElementById('rating-input').value = content.rating;
    document.getElementById('trailer-input').value = content.videoUrl || '';
    document.getElementById('image-input').value = content.imageUrl || '';
    document.getElementById('category-select').value = content.category || '';
    // document.getElementById('address').value = content.address || '';

    document.getElementById('submit-btn').hidden = true; 
    document.getElementById('cancel-btn').style.display = 'inline-block'; 
    document.getElementById('okUpdate-btn').style.display = 'inline-block'; 

    document.getElementById('form-add-new-content-title').hidden = true; 
    document.getElementById('form-update-content-title').style.display = 'inline-block'; 
    // document.getElementById('okUpdate-btn').style.display = 'inline-block';


    // formTitle.textContent = 'עריכת תוכן';
    // submitButton.textContent = 'שמירת שינויים';
    // cancelEditButton.hidden = false;
    // contentForm.scrollIntoView({ behavior: 'smooth' });
    // 1. תופסים את קטע היעד ב-HTML לפי ה-ID שלו
    const targetSection = document.getElementById('content-form');

    // 2. גלילה מדויקת וחלקה ישירות אליו
    targetSection.scrollIntoView({ 
        behavior: 'smooth', // גלילה חלקה (אנימציה) ולא קפיצה חדה
        block: 'start'      // גולל כך שראש הקטע ייעצר בדיוק בחלק העליון של המסך
    });

}