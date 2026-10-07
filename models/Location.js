const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true }, // שם הסניף/אולפן
    address: { type: String, required: true }, // כתובת
    lat: { type: Number, required: true }, // קו רוחב במפה
    lng: { type: Number, required: true }  // קו אורך במפה
});

module.exports = mongoose.model('Location', locationSchema);