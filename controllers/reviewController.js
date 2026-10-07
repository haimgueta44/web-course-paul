const Review = require('../models/Review');
// const WatchHistory = require('../models/WatchHistory');
// const bcrypt = require('bcryptjs');

async function createReview(req, res) {
    try {
        const review = new Review(req.body);
        await review.save();
        console.log("Review created successfully with ID:", review._id);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


async function getAllReviews(req, res) {
    try {
        console.log("Fetching reviews for content ID:", req.query.content);
        const reviews = await Review.find({ content: req.query.content },);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createReview,
    getAllReviews
};