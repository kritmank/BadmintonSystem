const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("home/game");
});

router.get("/add/:date", (req, res) => {
	const date = req.params.date;
	res.render("form/game_add", {
		date,
	});
});

router.post("/add", async (req, res) => {
  const { date, py1, py2, py3, py4, shuttle_no } = req.body;
	let player_ids = [];

  for (const py of [py1, py2, py3, py4]) {
    const query = await pool.query("SELECT id, name FROM players WHERE name = $1", [py]);
    if (query.rowCount == 0) {
      const player = await pool.query("INSERT INTO players (name) VALUES ($1) RETURNING id, name", [py]);
      player_ids.push(player.rows[0].id);
    } else {
      player_ids.push(query.rows[0].id);
    }
  }
  const game = await pool.query(
    "INSERT INTO games (date, player1, player2, player3, player4, shuttle_no) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [date, player_ids[0], player_ids[1], player_ids[2], player_ids[3], shuttle_no]
  );
  console.log("Added Game", game.rows[0]);
  res.redirect("/game");
});

router.get("/edit/:id", async (req, res) => {
  let game = await pool.query(`
  SELECT 
    games.id as id,
    games.shuttle_no,
    player1.name as player1,
    player2.name as player2,
    player3.name as player3,
    player4.name as player4 FROM games
    JOIN players player1 ON player1.id = games.player1
    JOIN players player2 ON player2.id = games.player2
    JOIN players player3 ON player3.id = games.player3
    JOIN players player4 ON player4.id = games.player4
    WHERE games.id = $1`, [req.params.id]);
  game = game.rows[0];
  res.render("form/game_edit", {
    game,
  });
});

router.post("/edit", async (req, res) => {
  const { id, py1, py2, py3, py4, shuttle_no } = req.body;
  console.log("Edit Game:", req.body);
  let player_ids = [];

  for (const py of [py1, py2, py3, py4]) {
    const query = await pool.query("SELECT id, name FROM players WHERE name = $1", [py]);
    if (query.rowCount == 0) {
      const player = await pool.query("INSERT INTO players (name) VALUES ($1) RETURNING id, name", [py]);
      player_ids.push(player.rows[0].id);
    } else {
      player_ids.push(query.rows[0].id);
    }
  }
  const game = await pool.query(
    "UPDATE games SET player1 = $1, player2 = $2, player3 = $3, player4 = $4, shuttle_no = $5 WHERE id = $6 RETURNING *",
    [player_ids[0], player_ids[1], player_ids[2], player_ids[3], shuttle_no, id]
  );
  console.log("Edited Game", game.rows[0]);
  res.redirect("/game");
});

router.get("/delete/:id", async (req, res) => {
  try {
    const game = await pool.query("DELETE FROM games WHERE id = $1", [req.params.id]);
    console.log("Delete Game", game.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
  res.redirect("/game");
});

module.exports = router;
