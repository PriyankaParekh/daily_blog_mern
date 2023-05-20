const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express()
require('dotenv').config()
    //require("./db/config");
const PORT = process.env.PORT || 5000

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//app.get('/', (req, res) => {
//        res.send('Hello World!')
//    })
//app.use((req, res, next) => {
//    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//    res.header(
//        "Access-Control-Allow-Headers",
//        "Origin,X-Requested-With, Content-Type, Accept"
//    );
//    next();
//})
mongoose.set('strictQuery', false);
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("/", function(_, res) {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        function(err) {
            res.status(500).send(err);
        }
    );
});
app.use('/blog', require('./router/Register'));
app.use('/blog', require('./router/DisplayBlog'));
app.use('/blog', require('./router/ContactData'));


//app.listen(PORT, () => {
//    console.log(`App listening on port ${PORT}`)
//})
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})