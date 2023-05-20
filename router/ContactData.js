const express = require('express');
const router = express.Router();
const Contact = require('../db/contact');
const { body, validationResult } = require("express-validator");


router.post("/contact",
    body("name", "Incorrect Name").isLength({ min: 5 }),
    body("email", "Incorrect Email").isEmail(),
    body("phone", "Incorrect Phone Number").isLength({ min: 10 }),
    body("city", "Incorrect City").isLength({ min: 5 }),
    body("desc", "Incorrect Description").isLength({ min: 5 }),
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            await Contact.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                city: req.body.city,
                desc: req.body.desc
            })
            res.json({ success: true });

        } catch (e) {
            console.log(e);
            res.json({ success: false });

        }
    })

module.exports = router;