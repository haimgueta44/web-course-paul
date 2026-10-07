async function fetchWatchHistory() {
    try {
        const response = await fetch('/api/watch-history', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const history = await response.json();
        // console.log("✅ היסטוריית צפייה:", history[0]);
        console.log("✅ היסטוריית צפייה: " + JSON.stringify(history, null, 2));

        if(history.length === 0) {
            document.getElementById('watch-history-row').innerHTML = '<p>לא נמצאו סרטים בהיסטוריית הצפייה שלך.</p>';
            return;
        }
            document.getElementById('watch-history-row').innerHTML = history.map(item => `
                <div class="movie-card">
                <a href="/infoContent?id=${item.content._id}" >
                
                    <img src="${item.content.imageUrl}" alt="${item.content.title}">
                    <div class="movie-info">
                        <h5>${item.content.title}</h5>
                    </div>
                </a>
                </div>
            `).join('');
        

    } catch (error) {
        console.error('שגיאה בFetchRequest היסטוריית צפייה:', error);
    }
}
fetchWatchHistory();




//  המלצת תוכן אישית   
async function loadRecommendations() {
    try {
        const response = await fetch('/api/contents/recommendation');
        if (!response.ok) throw new Error('שגיאה בטעינת ההמלצות');
        
        const movies = await response.json();

        document.getElementById('recommendations-row').innerHTML = movies.map(item => `
                <div class="movie-card">
                <a href="/infoContent?id=${item._id}" >
                
                    <img src="${item.imageUrl}" alt="${item.title}">
                    <div class="movie-info">
                        <h5>${item.title}</h5>
                    </div>
                </a>
                </div>
            `).join('');
        
        // כאן אתה מציג את הסרטים ב-HTML (למשל בתוך סליידר או גריד)
        console.log("10 הסרטים המומלצים עבורך:", movies);
        // renderMoviesToUI(movies); 
    } catch (error) {
        console.error(error);
    }
}

// קריאה לפונקציה בטעינת העמוד
window.addEventListener('DOMContentLoaded', loadRecommendations);
