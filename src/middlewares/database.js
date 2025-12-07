const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://hemanth:hemanth%40123@namastenodepractice.moxwtbc.mongodb.net/dev-tinder');
}

module.exports = connectDB;