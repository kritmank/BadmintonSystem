const express = require("express");
const pool = require("../db");
const router = express.Router();
const api = require("./api");

router.get("/", async (req, res) => {
    res.render("liff/loading");
});

router.post("/handler", async (req, res) => {
    const { userID, displayName } = req.body;
    console.log("User Enter:", displayName, userID);

    const query = await pool.query("SELECT * FROM players WHERE line_id = $1", [userID]);
    if (query.rowCount == 0) {
        res.render("liff/register", {
            userID
        });
        return;
    }

    const name = query.rows[0].name;
    const lineName = await api.getLineName(name);

    let isFriend = true;
    if (lineName == name) {
        isFriend = false;
    }
    res.render("liff/success", {
        displayName,
        isFriend,
    });
});

router.post("/register", async (req, res) => {
    const { userID, name } = req.body;
    const user = await pool.query("UPDATE players SET line_id = $1 WHERE name = $2 RETURNING *", [userID, name]);
    res.redirect("/liff");
    console.log("User Register:", user.rows[0]);
});

module.exports = router;