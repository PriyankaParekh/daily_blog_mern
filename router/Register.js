const express = require("express");
const router = express.Router();
const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "mynameisPriyankaParekhITVGECsem6$#";
const { body, validationResult } = require("express-validator");

router.post(
    "/register",
    body("name", "Incorrect Name").isLength({ min: 5 }),
    body("email", "Incorrect Email").isEmail(),
    body("password", "Incorrect Password").isLength({ min: 5 }),
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let seqPassword = await bcrypt.hash(req.body.password, salt);
        try {
            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: seqPassword,
            });
            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    }
);

router.post(
    "/login",
    body("email", "Incorrect Email").isEmail(),
    body("password", "Incorrect Password").isLength({ min: 5 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(404).json({ emailnotfound: "Email not found" });
            }
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    const data = {
                        id: user.id,
                        name: user.name,
                    };
                    jwt.sign(
                        data,
                        jwtSecret, {
                            expiresIn: 31556926, // 1 year in seconds
                        },
                        (err, authToken) => {
                            res.json({
                                success: true,
                                authToken: authToken,
                            });
                        }

                    );
                    console.log(req.user);
                } else {
                    return res
                        .status(400)
                        .json({ passwordincorrect: "Password incorrect" });
                }
            });
        });
    }
);

module.exports = router;