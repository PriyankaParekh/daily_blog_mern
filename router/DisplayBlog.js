const express = require("express");
const router = express.Router();
const Blog = require("../db/blog");
const fs = require("fs");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const Storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: Storage,
});

router.get("/allblog", async(req, res) => {
    try {
        const data = await Blog.find();
        res.json({ success: true, data: { data } });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

router.post("/add", upload.single("file"), async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const newImage = new Blog({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        image: {
            data: fs.readFileSync(req.file.path),
            contentType: req.file.mimetype,
        },
        category: req.body.category,
        email: req.body.email
    });
    newImage
        .save()
        .then(() => res.send("success"))
        .catch((err) => console.log(err));
});

router.get('/mypost/:email', async(req, res) => {
    const { email } = req.params;
    try {
        const data = await Blog.find({ email: email });
        res.json({ success: true, data: { data } });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

router.put("/updateblog/:id", async(req, res) => {
    let result = await Blog.updateOne({ _id: req.params.id }, { $set: req.body });
    res.send(result);
})
router.get("/oneblog/:id", async(req, res) => {
    let result = await Blog.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: "Not Found.. " })
    }
})
router.delete("/deleteblog/:id", async(req, res) => {
    const result = await Blog.deleteOne({ _id: req.params.id });
    res.send(result);
})

router.post('/like/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const blogPost = await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
        res.json(blogPost);
    } catch (error) {
        console.error('Error incrementing likes:', error);
        res.status(500).json({ error: 'An error occurred while incrementing likes' });
    }
});


module.exports = router;