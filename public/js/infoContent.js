
let movieId; // משתנה גלובלי לאחסון ה-ID של הסרט
let commentsContainer = document.getElementById('commentsContainer');
// const playButton = document.getElementById('play-button');
// let player;
let movie;
let srcWithAutoplay;
document.addEventListener('DOMContentLoaded', async () => {
    // 1. חילוץ ה-ID מתוך ה-URL של הדפדפן
    const urlParams = new URLSearchParams(window.location.search);
    movieId = urlParams.get('id'); // שולף את הערך שכתוב אחרי ?id=

    // הגנה קטנה: אם המשתמש הגיע לדף בלי ID, נחזיר אותו לדף הבית
    if (!movieId) {
        alert('לא נבחר סרט תקין');
        window.location.href = '/';
        return;
    }

    // 2. כעת שיש לנו את ה-ID, נבצע בקשת AJAX (fetch) ל-API של השרת
    try {
        const response = await fetch(`/api/contents/${movieId}`);
        movie = await response.json(); // כאן קיבלנו את האובייקט המלא של הסרט מהמסד נתונים

        // 3. הזרקת הנתונים לתוך ה-HTML
        document.getElementById('movie-title').innerText = movie.title;
        // document.getElementById('movie-poster').src = movie.imageUrl;
        document.getElementById('movie-description').innerText = movie.description;
        document.getElementById('movie-rating').innerText = `⭐ ${movie.rating}`;

        // בתוך פונקציית הזרקת הנתונים של עמוד ה-infoContent שלך:
        const trailerIframe = document.getElementById('movie-trailer');
        // const autoplayTrailerIframe = document.getElementById('cover-movie-trailer');

        if (movie.videoUrl) {
            // המרת קישור יוטיוב רגיל לקישור embed תואם iframe במידת הצורך
            let embedUrl = movie.videoUrl;
            if (embedUrl.includes('watch?v=')) {
                embedUrl = embedUrl.replace('watch?v=', 'embed/');
            }

            // if(trailerIframe) {
            // הנגן הסטטי (הראשון שהמשתמש רואה)
            trailerIframe.src = embedUrl;
            // }
            // else if(autoplayTrailerIframe) {
               // הנגן האוטומטי (שיופיע רק אחרי הלחיצה על הכיסוי)
                const separator = embedUrl.includes('?') ? '&' : '?';
                srcWithAutoplay = `${embedUrl}${separator}autoplay=1&mute=1`; 
            // }
            

            // trailerIframe.src = embedUrl;
        } else {
            // אם אין טריילר, אפשר להסתיר את מסגרת הוידאו
            document.querySelector('.video-frame-wrapper').style.display = 'none';
        }
        // --- בתוך פונקציית הזרקת הנתונים (תחת try אחרי שקיבלת את ה-movie מהשרת) ---
        

        // const playButton = document.getElementById('movie-trailer');
        // playButton.addEventListener('click', () => {
        //     // כאן אפשר להוסיף קוד שירשום את הצפייה או יפעיל את הוידאו
        //     console.log("Play button clicked for movie ID:", movieId);
        // });


        //משיכת הביקורות של הסרט
        const responseReviews = await fetch(`/api/reviews?content=${movieId}`);
        const reviews = await responseReviews.json(); // כאן קיבלנו את האובייקט המלא של הסרט מהמסד נתונים


        console.log('נתוני הסרט שהתקבלו מהשרת:', movie);
        console.log(' התגובות שהתקבלו מהשרת:', reviews);

        const commentsContainer = document.getElementById('commentsContainer');
        // commentsContainer.innerHTML = '';

        // if (reviews && reviews.length !== 0) {
        // commentsContainer.innerHTML = '<p class="no-comments-msg">אין עדיין תגובות לתוכן זה. תהיה הראשון לכתוב!</p>';
        // return;
        // }

        if (reviews && reviews.length !== 0) {
        commentsContainer.innerHTML = '';

        reviews.reverse().forEach(comment => {
        // יצירת אלמנט לכל תגובה
        if(comment.text != ""){
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment-text-item');
        
        // הגדרת הטקסט מתוך ה-text של הביקורת שהגיע מהשרת
        commentElement.textContent = comment.text;

        // הוספה לחלון הנגלל (append יוסיף לסוף הרשימה, prepend לראש הרשימה)
        commentsContainer.appendChild(commentElement);            
        }

        })
        }

        // אם יש דירוג, נציג אותו גם כן
        if(movie.rating != null && movie.rating != ""){
            document.getElementById('movie-rating').textContent = `⭐ ${movie.rating} (${movie.rating_count} דירוגים)`;
        }
    
    


    } catch (error) {
        console.error('שגיאה בטעינת נתוני הסרט:', error);
    }

  
});



//האזנה ללחיצה על הסרטון והוספה להסטורית הצפייה
document.getElementById('coverTheFrame').addEventListener('click', async () => {
    console.log("הסרטון נלחץ, נרשום את הצפייה בהסטורית הצפייה");
    document.getElementById('coverTheFrame').style.display = 'none'; // הסתרת הכיסוי האדום
    document.getElementById('movie-trailer').style.display = 'none'; // הסתרת הנגן הסטטי 

    const autoplayTrailerIframe = document.getElementById('cover-movie-trailer');
    autoplayTrailerIframe.style.display = 'block'; // הצגת הוידאו עם autoplay
    autoplayTrailerIframe.src = srcWithAutoplay; // הפעלת הוידאו עם autoplay

    // const currentTime = Math.floor(player.getCurrentTime());

        try {
        await fetch(`/api/watch-history/${movieId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // ה-contentId ירד מכאן! שולחים בגוף רק את זמן העצירה
                stoppedAt: null || 0 // או כל ערך אחר שתרצה לשלוח, אם יש צורך 
            })
        });
        console.log("התקדמות הצפייה נשמרה בשרת:");
    } catch (error) {
        console.error("שגיאה בשמירת התקדמות הצפייה:", error);
        console.log("שגיאה בשמירת התקדמות הצפייה:", error);
    }
});



//הוספת ביקורת חדשה
document.getElementById('commentForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // 1. עוצר את הדפדפן מלרענן את העמוד כברירת מחדל
    console.log(e.target); // Debugging line
    // 2. כאן הקוד אוסף אוטומטית את הערכים מכל השדות:
    console.log("profile ID: ",  sessionStorage.getItem('profileId'));
    const reviewData = {
        "profile": sessionStorage.getItem('profileId'), // כאן צריך להכניס את ה-ID של המשתמש שהתחבר
        "content": movieId, // כאן צריך להכניס את ה-ID של הסרט שהתקבל מה-URL
        "rating": e.target.querySelector('#rating').value,
        "text": e.target.querySelector('#text').value
    };

    console.log("Submitting movie data:", reviewData); // Debugging line
    
    try {
        // 2. שליחת המידע לשרת ביצירה חדשה (POST)
        const response = await fetch('/api/reviews', {
            method: 'POST', // מציין שמדובר ביצירת משאב חדש
            headers: {
                'Content-Type': 'application/json' // אומר לשרת שאנחנו שולחים מידע בפורמט JSON
            },
            body: JSON.stringify(reviewData) // הפיכת אובייקט ה-JavaScript למחרוזת טקסט (String)
        });

        // 3. בדיקה אם השרת קיבל ושמר את המידע בהצלחה
        if (response.ok) {
            alert('התוכן נוסף בהצלחה למסד הנתונים!');
            
            
            const comment = await response.json();
            console.log('תגובה חדשה שהתקבלה מהשרת:', comment);

            if(comment.text != ""){
              const commentElement = document.createElement('div');
                commentElement.classList.add('comment-text-item');
                
                // הגדרת הטקסט מתוך ה-text של הביקורת שהגיע מהשרת
                commentElement.textContent = comment.text;              
                
                // הוספה לחלון הנגלל (append יוסיף לסוף הרשימה, prepend לראש הרשימה)
                const noCommentsMsg = document.getElementById('noCommentsMsg');
                if (noCommentsMsg) {
                    console.log("Removing 'no comments' message since a new comment was added.");
                    noCommentsMsg.style.display = 'none'; // הסרת ההודעה אם היא קיימת
                }
                commentsContainer.prepend(commentElement)
            }

            if(comment.rating != null && comment.rating != ""){
                const rating_count = movie.rating_count;
                // console.log("Current rating count:", movie);
                const currentRatingAfterCalc = movie.rating * rating_count;
                // console.log("Current rating after calculation:", currentRatingAfterCalc);
                const newRating = +((currentRatingAfterCalc + parseFloat(comment.rating)) / (rating_count + 1)).toFixed(1);
                // console.log("New calculated rating:", newRating);
                const contentData = {
                    rating: newRating,
                    rating_count: rating_count + 1
                };
                console.log("Preparing to update content with new rating:", contentData);

                const response = await fetch(`/api/contents/${movieId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contentData)
                });
                if (response.ok) {
                    alert('הדירוג עודכן בהצלחה.');
                    // loadContents(); // טעינה מחדש של הקטלוג
                    // stopEditing();
                    // location.reload();
                    // console.log('תגובה חדשה הוספה בהצלחה למסד הנתונים:', response.body);

                    const movieRating = document.getElementById('movie-rating');
                    if (movieRating) {
                        movieRating.textContent = `⭐ ${newRating} (${movie.rating_count+1} דירוגים)`;
                    }
                } else {
                    alert('העדכון של הדירוג נכשל. אנא נסה שוב.');
                }
            }
            
            // 4. איפוס וניקוי הטופס אוטומטית
            // resetForm(); 
            await document.getElementById('commentForm').reset();
            
            // 5. טעינה מחדש של הקטלוג למטה כדי לראות את הסרט החדש מיידית
            // loadContents(); 

            console.log('נתוני הסרט שהתקבלו מהשרת:', movie);
        } else {
            alert('השליחה של התגובה נכשלה. אנא ודא שכל השדות תקינים.');
        }

    } catch (error) {
        console.error('שגיאה בתקשורת עם השרת:', error);
        alert('אופס! קיימת בעיית תקשורת עם השרת.');
    }

});


// function resetForm() {
    // document.getElementById('profile-form').reset();
    // document.getElementById('profile-id').value = '';
    
    // // החזרת כפתורים וכותרות למצב הוספה
    // document.getElementById('form-title').innerText = '➕ הוספת פרופיל חדש';
    // document.getElementById('submit-btn').style.display = 'inline-block';
    // document.getElementById('okUpdate-btn').style.display = 'none';
    // document.getElementById('cancel-btn').style.display = 'none';
// }

// // שליחת הטופס לעדכון בשרת
// const okUpdateButton = document.getElementById('okUpdate-btn');
// okUpdateButton.addEventListener('click', async () => {
//     console.log("okUpdate button clicked"); // Debugging line

//     const contentId = content._id;
//     const contentData = {
//         title: document.getElementById('title-input').value,
//         description: document.getElementById('description-input').value,
//         category: document.getElementById('category-select').value,
//         type: document.getElementById('type-select').value,
//         releaseYear: document.getElementById('releaseYear-input').value,
//         rating: document.getElementById('rating-input').value,
//         videoUrl: document.getElementById('trailer-input').value,
//         imageUrl: document.getElementById('image-input').value,
//     };

//     try {
//         // console.log("מנסה למחוק תוכן עם ID:", contentId); // Debugging line
//         const response = await fetch(`/api/contents/${contentId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(contentData)
//         });

//         if (response.ok) {
//             alert('התוכן עודכן בהצלחה.');
//             // loadContents(); // טעינה מחדש של הקטלוג
//             // stopEditing();
//             location.reload();
//         } else {
//             alert('העדכון נכשל. אנא נסה שוב.');
//         }
        
//         } catch (error) {
//             console.error('שגיאה בעדכון התוכן:', error);
//             alert('אופס! קיימת בעיית תקשורת עם השרת.');
//         }

// });

// //לחיצה על כפתור הפליי ביוטיוב
// // משתנה שיחזיק את הנגן
// let player;

// // פונקציית חובה של יוטיוב - רצה אוטומטית כשה-API מוכן לפעולה
// function onYouTubeIframeAPIReady() {
//   // מחברים את הנגן ל-iframe הקיים שלך לפי ה-ID שלו
//   player = new YT.Player('movie-trailer', {
//     events: {
//       'onStateChange': handlePlayerStateChange // הפונקציה שתטפל בלחיצות
//     }
//   });
// }

// // הפונקציה שמזהה את הלחיצה על כפתור הפליי
// function handlePlayerStateChange(event) {
//   // YT.PlayerState.PLAYING (או המספר 1) אומר שהסרטון התחיל להתנגן
//   if (event.data === YT.PlayerState.PLAYING) {
//     console.log("זוהתה לחיצה על Play! הסרטון מתנגן כעת.");
    
//     // כאן הקוד שלך: (למשל פתיחת פופאפ, שליחת אנליטיקס וכו')
//   }
// }


