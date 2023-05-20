const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    category: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    email: {
        type: String,
    },
});

module.exports = mongoose.model("blog", BlogSchema);