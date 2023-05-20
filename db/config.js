const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
if (mongoose.connect("mongodb+srv://admin:8wLQWiWSVnmWpiSq@blogs.xoasa5q.mongodb.net/?retryWrites=true&w=majority")) {
    console.log("Connection Successfull.");
} else {
    console.log(console.error());
}