const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home/payment");
});

module.exports = router;