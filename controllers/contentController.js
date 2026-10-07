// Controller של תכנים: CRUD, חיפושים ופעולות Aggregation עבור סרטים וסדרות.
const Content = require('../models/Content');
const WatchHistory = require('../models/WatchHistory');

const mongoose = require('mongoose');

/** מחזירה את כל הסרטים והסדרות הקיימים במסד הנתונים. */
// async function getAllContents(req, res) {
//     try {
//         const contents = await Content.find();
//         res.json(contents);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to get contents' });
//     }
// }

/** מחפשת תכנים לפי חלק משם הכותרת, ללא תלות באותיות גדולות וקטנות. */
// async function searchContents(req, res) {
//     try {
//         if (!req.query.title) {
//             return res.status(400).json({ message: 'Title is required' });
//         }

//         const contents = await Content.find({
//             title: { $regex: req.query.title, $options: 'i' }
//         });

//         res.json(contents);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to search contents' });
//     }
// }

// /** מחפשת לפי שלושה פרמטרים: קטגוריה, סוג ודירוג מינימלי. */
// async function advancedSearch(req, res) {
//     try {
//         const { category, type, minRating } = req.query;

//         if (!category || !type || minRating === undefined) {
//             return res.status(400).json({ message: 'Category, type and minimum rating are required' });
//         }

//         const contents = await Content.find({
//             category: { $regex: category, $options: 'i' },
//             type,
//             rating: { $gte: Number(minRating) }
//         });

//         res.json(contents);
//     } catch (error) {
//         res.status(500).json({ message: 'Advanced search failed' });
//     }
// }

// /** מחפשת לפי חלק מהכותרת וטווח שנים הכולל שנת התחלה ושנת סיום. */
// async function searchByYear(req, res) {
//     try {
//         const { title, fromYear, toYear } = req.query;

//         if (!title || !fromYear || !toYear) {
//             return res.status(400).json({ message: 'Title and year range are required' });
//         }

//         const contents = await Content.find({
//             title: { $regex: title, $options: 'i' },
//             releaseYear: {
//                 $gte: Number(fromYear),
//                 $lte: Number(toYear)
//             }
//         });

//         res.json(contents);
//     } catch (error) {
//         res.status(500).json({ message: 'Year search failed' });
//     }
// }

// /** מבצעת Aggregation שמקבץ תכנים לפי קטגוריה ומחשב כמות ודירוג ממוצע. */
// async function getCategoryStats(req, res) {
//     try {
//         const stats = await Content.aggregate([
//             {
//                 $group: {
//                     _id: '$category',
//                     count: { $sum: 1 },
//                     averageRating: { $avg: '$rating' }
//                 }
//             },
//             { $sort: { count: -1 } }
//         ]);

//         res.json(stats);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to load category statistics' });
//     }
// }

// /** מבצעת Aggregation שמקבץ תכנים לפי movie או series ומחשב נתונים מסכמים. */
// async function getTypeStats(req, res) {
//     try {
//         const stats = await Content.aggregate([
//             {
//                 $group: {
//                     _id: '$type',
//                     count: { $sum: 1 },
//                     averageRating: { $avg: '$rating' }
//                 }
//             },
//             { $sort: { count: -1 } }
//         ]);

//         res.json(stats);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to load type statistics' });
//     }
// }

// /** יוצרת תוכן חדש מהנתונים שב-body ומפעילה את בדיקות ה-Model. */
async function createContent(req, res) {
    try {
        const content = new Content(req.body);
        await content.save();
        res.status(201).json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// /** מעדכנת תוכן לפי id ומחזירה את הרשומה החדשה לאחר Validation. */
async function updateContent(req, res) {
    console.log("הנתונים שהגיעו מהטופס לשרת:", req.body);
    try {
        const content = await Content.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/** מוחקת תוכן וגם מנקה רשומות היסטוריה וביקורות שמפנות אליו. */
async function deleteContent(req, res) {
    try {
        // console.log("התקבלה בקשת מחיקה עבור ID:", req.params.id);
        const content = await Content.findByIdAndDelete(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // await WatchHistory.deleteMany({ content: content._id });
        // await Review.deleteMany({ content: content._id });
        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//הבאת כל התכנים כולל עימוד
async function getAllContents(req, res) {
    try {
        const limit = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const { search, category, sort } = req.query;

        const queryFilter = {};

        if (search) {
            queryFilter.title = { $regex: '^' + search, $options: 'i' };
        }
        
        // if (category) {
        //     // אם המערך במסד הנתונים מכיל מספר קטגוריות, MongoDB יחפש התאמה בפנים אוטומטית
        //     queryFilter.category = category; 
        // }

        // בתוך הפונקציה getAllContents הקיימת שלכם, החליפו את הטיפול ב-category לקטע הבא:
        if (category) {
            // שומר על תאימות מלאה: MongoDB יודע לחפש ערך בתוך מערך אוטומטית
            queryFilter.category = category; 
        }

         // 3. בניית אובייקט המיון (Sort Object)
        let sortOrder = {};
        if (sort === 'rating_desc')  sortOrder = { rating: -1 }; // מהגבוה לנמוך
        if (sort === 'rating_asc')   sortOrder = { rating: 1 };  // מהנמוך לגבוה
        if (sort === 'year_desc')    sortOrder = { releaseYear: -1 };
        if (sort === 'year_asc')     sortOrder = { releaseYear: 1 };


        const contents = await Content.find(queryFilter)
                                  .sort(sortOrder) // מריץ את המיון שבחרנו
                                  .skip(skip)
                                  .limit(limit);

        // 2. ספירת סך כל הסרטים במסד הנתונים (כדי לדעת מתי נגמרו העמודים)
        const totalMovies = await Content.countDocuments(queryFilter);
        const totalPages = Math.ceil(totalMovies / limit);


        res.status(200).json({
            contents,
            currentPage: page,
            totalPages
        });


    } catch (error) {
        res.status(500).json({ message: 'Failed to get contents' });
    }
}


//הבאת תוכן לפי id
async function getContentById(req, res) {
    try {
        const { id } = req.params; // שליפת ה-ID מתוך הנתיב הדינמי

        // חיפוש הסרט הספציפי במסד הנתונים
        const movie = await Content.findById(id);

        if (!movie) {
            return res.status(404).json({ message: "הסרט לא נמצא" });
        }

        // החזרת אובייקט הסרט כ-JSON
        res.status(200).json(movie);
    } catch (error) {
        // טיפול במצב שבו ה-ID שנשלח לא תקין במבנה שלו (CastError)
        res.status(500).json({ message: "שגיאה בקבלת נתוני הסרט", error: error.message });
    }
 
};


// משיכת כל הקטגוריות
async function getActiveCategories(req, res) {
    try {
        // distinct('category') מוצאת את כל הערכים הייחודיים בשדה category ב-DB
        // ומחזירה מערך פשוט של סטרינגים, למשל: ['פעולה', 'דרמה', 'מתח']
        console.log("מנסה למשוך את כל הקטגוריות הפעילות במסד הנתונים...");
        const categories = await Content.distinct('category');
        
        // בונוס: מיון אלפביתי כדי שהרשימה בסינון תיראה מסודרת
        // categories.sort(); 

        console.log("✅ קטגוריות פעילות שנמצאו במסד הנתונים:", categories);
        res.status(200).json(categories);
    } catch (error) {
        console.error("שגיאה בטעינת הקטגוריות:", error);
        res.status(500).json({ message: 'Failed to load categories', error: error.message });
    }
}




/** פונקציה שמחזירה המלצות אישיות למשתמש לפי היסטוריית הצפייה שלו. */
/** שליפת 10 המלצות תוכן מותאמות אישית לפרופיל */
async function getRecommendations(req, res) {
    try {
        const profileId = req.session.profileId; // מזהה הפרופיל מהסשן של המשתמש המחובר

        if (!profileId) {
            return res.status(401).json({ message: 'משתמש לא מחובר או פרופיל לא נבחר' });
        }

        // א. שליפת רשימת ה-ID של כל התכנים שהפרופיל כבר צפה בהם
        const watchedHistory = await WatchHistory.find({ profile: profileId }).select('content');
        const watchedContentIds = watchedHistory.map(history => history.content);

        // ב. ניתוח היסטוריית הצפייה למציאת הקטגוריות הנצפות ביותר
        const topCategoriesData = await WatchHistory.aggregate([
            { $match: { profile: new mongoose.Types.ObjectId(profileId) } },
            { 
                $lookup: {
                    from: 'contents', // שם הקולקשן של Content ב-MongoDB
                    localField: 'content',
                    foreignField: '_id',
                    as: 'contentDetails'
                }
            },
            { $unwind: '$contentDetails' },
            { $group: { _id: '$contentDetails.category', count: { $sum: 1 } } },
            { $sort: { count: -1 } } // מיון מהקטגוריה הכי נצפית להכי פחות נצפית
        ]);

        const preferredCategories = topCategoriesData.map(cat => cat._id);

        let recommendedContents = [];

        // ג. תנאי: אם המשתמש צפה לפחות בתוכן אחד ויש לנו קטגוריות מועדפות
        if (preferredCategories.length > 0) {
            /* 
               שליפת סרטים מהקטגוריות המועדפות שהמשתמש *לא* צפה בהם.
               ההיררכיה: מיון ראשון לפי מיקום הקטגוריה ברשימת המועדפים של המשתמש,
               ומיון שני פנימי לפי הדירוג הגבוה ביותר של הסרט.
            */
            recommendedContents = await Content.aggregate([
                { 
                    $match: { 
                        _id: { $nin: watchedContentIds },          // סרטים שלא נצפו
                        category: { $in: preferredCategories }     // ששייכים לקטגוריות הנצפות
                    } 
                },
                {
                    $addFields: {
                        // מוצאים את האינדקס של קטגוריית הסרט במערך ההעדפות (כדי למיין לפיו)
                        categoryOrder: { $indexOfArray: [preferredCategories, '$category'] }
                    }
                },
                { 
                    $sort: { 
                        categoryOrder: 1, // קטגוריות נצפות יותר יופיעו קודם
                        rating: -1        // מיון פנימי בתוך הקטגוריה לפי הדירוג הכי גבוה
                    } 
                },
                { $limit: 10 } // הגבלה ל-10 תוצאות לכל היותר
            ]);
        }

        // ד. גיבוי 1 (Fallback 1): אם אין 10 תכנים, נשלים מהתכנים הכי מדורגים באתר שהוא *לא* צפה בהם
        if (recommendedContents.length < 10) {
            const currentIds = recommendedContents.map(c => c._id);
            // רשימה של תכנים שלא צפו בהם וגם לא נמצאים כבר בתוך רשימת ההמלצות הנוכחית
            const excludeIds = [...watchedContentIds, ...currentIds];
            const remainderLimit = 10 - recommendedContents.length;

            const fallbackContent = await Content.find({ _id: { $nin: excludeIds } })
                .sort({ rating: -1 })
                .limit(remainderLimit);

            recommendedContents = recommendedContents.concat(fallbackContent);
        }

        // ה. מוצא אחרון (Fallback 2): אם עדיין אין 10 סרטים (כי הוא צפה כמעט בהכל והמאגר הלא-נצפה קטן מ-10)
        // מציגים את 10 הסרטים הכי מדורגים באתר באופן כללי, גם אם הם נצפו כבר.
        if (recommendedContents.length < 10) {
            recommendedContents = await Content.find({})
                .sort({ rating: -1 })
                .limit(10);
        }

        // החזרת התשובה ללקוח (Frontend)
        res.status(200).json(recommendedContents);

    } catch (error) {
        res.status(500).json({ message: 'שגיאה בהפקת המלצות תוכן', error: error.message });
    }
}









module.exports = {
    getAllContents,
    getContentById,
    // searchContents,
    // advancedSearch,
    // searchByYear,
    // getCategoryStats,
    // getTypeStats,
    createContent,
    updateContent,
    deleteContent,
    getActiveCategories,
    getRecommendations
    // getRecommendations
    // getCategories
};
