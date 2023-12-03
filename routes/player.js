const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home/player");
});

router.get("/add", (req, res) => {
    res.render("form/player_add");
});

router.post("/add", async (req, res) => {
    const { name } = req.body;
    const newPlayer = await pool.query(
        "INSERT INTO players (name) VALUES ($1) RETURNING *",
        [name]
    );
    console.log("Add New Player", newPlayer.rows[0])
    res.redirect("/player");
});

router.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const player = await pool.query("SELECT * FROM players WHERE id = $1", [id]);
    res.render("form/player_edit", { player: player.rows[0] });
});

router.post("/edit/:id", async (req, res) => {
    const { id, name } = req.body;
    const player = await pool.query(
        "UPDATE players SET name = $1 WHERE id = $2",
        [name, id]
    );
    console.log("Edit Player", player.rows[0])
    res.redirect("/player");
});

router.get("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const player = await pool.query("DELETE from players WHERE id = $1", [id]);
        console.log("Delete Player", player.rows[0])
    } catch (err) {
        console.error(err.message);
    }
    res.redirect("/player");
});

module.exports = router;
