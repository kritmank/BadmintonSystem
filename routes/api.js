const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");

async function findPlayer(name) {
	const query = await pool.query("SELECT * FROM players WHERE name = $1", [
		name,
	]);
	if (query.rowCount == 0) {
		return { status: false };
	} else {
		return {
			status: true,
			id: query.rows[0].id,
		};
	}
}

async function queryGames(date) {
	const games = await pool.query(
		`SELECT 
    games.id as id,
    games.shuttle_no,
    players1.name as player1,
    players2.name as player2,
    players3.name as player3,
    players4.name as player4
    FROM games
    JOIN players players1 ON players1.id = games.player1
    JOIN players players2 ON players2.id = games.player2
    JOIN players players3 ON players3.id = games.player3
    JOIN players players4 ON players4.id = games.player4
    WHERE date = $1
    ORDER BY games.shuttle_no, games.id`,
		[date]
	);
	return games.rows;
}

async function queryPayments(date) {
	const games = await queryGames(date);
	if (games.length == 0) {
		return [];
	}

	let sum = 0;
	let payments = {};

	for (let i = 0; i < games.length; i++) {
		const game = games[i];
		const sameShuttle = games.filter((g) => g.shuttle_no == game.shuttle_no);
		const index = sameShuttle.indexOf(game);

		let cost;
		if (sameShuttle.length == 1) {
			cost = 60;
		} else {
			switch (index) {
				case 0:
					cost = 40;
					break;
				default:
					cost = 20;
			}
		}

		let players = [];
		let playerCount = 0;
		for (const i_py of [1, 2, 3, 4]) {
			const py = game[`player${i_py}`];
			if (py != "None") {
				playerCount++;
				players.push(py);
			}
		}

		sum += cost;
		cost /= playerCount;
		for (const py of players) {
			if (py in payments) {
				payments[py] += cost;
			} else {
				payments[py] = cost;
			}
		}
	}
	payments["Total"] = sum;

	for (const py in payments) {
		payments[py] = Math.round(payments[py]);
	}
	return [payments];
}

async function getLineName(py) {
  const query = await pool.query("SELECT line_id FROM players WHERE name = $1", [
    py,
  ]);
  if (query.rowCount == 0 || query.rows[0].line_id == null) {
    return py;
  } 
  
  const userID = query.rows[0].line_id;
  access_token = "d0/x8ZPRHwEoIVu2W1NjEajB0hv/4UMCRsysi3jVx/atEbBKKKseIOGOomf6vW1ZMcpm4zxrn7OQAQoGedhVI+fPKtnw9DcSKdYqmZuDCxMkAgvDmf+ggPau/CGH+ME4aPurE4CIwIW/x08q/52cWwdB04t89/1O/w1cDnyilFU=";
  headers = {
    Authorization: `Bearer ${access_token}`
  }
  url = `https://api.line.me/v2/bot/profile/${userID}`;

  try {
    const req = await axios.get(url, { headers });
    return req.data.displayName;
  } catch (error) {
	switch (error.response.status) {
		case 404:
			console.log("Not Friend");
			break;
		default:
			console.error(error.response.statusText);
	}
    return py;
  }
}

router.get("/game-by-date/:date", async (req, res) => {
	res.json(await queryGames(req.params.date));
});

router.get("/players", async (req, res) => {
	const players = await pool.query(
		"SELECT name, id FROM players ORDER BY name"
	);
	res.json(players.rows);
});

router.post("/player-find", async (req, res) => {
	const { name } = req.body;
	res.json(await findPlayer(name));
});

router.get("/payment-by-date/:date", async (req, res) => {
	res.json(await queryPayments(req.params.date));
});

router.get("/payment-notify/:date", async (req, res) => {
  res.json({status: "OK"});
  const date = req.params.date;
  let payments = await queryPayments(date);

  if (payments.length == 0) {
    payments = {Total: 0};
  } else {
    payments = payments[0];
  }

  let message = `
--- Payment Today💸 ---

📆 Date: ${date}

`;
let players = [];
  for (const py in payments) {
    const line_name = await getLineName(py);
    players.push({
      name: py,
      line_name: line_name,
      amount: payments[py],
    });
  }
  const sortedData = players.slice().sort((a, b) => {
    if (a.line_name == "Total") {
      return 1;
    } else {
      if (b.line_name == "Total") {
        return -1;
      }
    }

		const nameA = a.line_name.toUpperCase(); // Ignore case during sorting
		const nameB = b.line_name.toUpperCase();

		if (nameA < nameB) {
			return -1;
		}

		if (nameA > nameB) {
			return 1;
		}

		return 0; // Names are equal
	});

  for (const py of sortedData) {
    if (py.name == "Total") {
      message += "\n💥 ";
    }
    message += `${py.line_name}: ${py.amount}฿\n`;
  }
  message += "-".repeat(22);
  console.log(message);

  // Send message to Line
  const url = "https://notify-api.line.me/api/notify";
  const token = "ykgmsRWjsGHeefMRx9BgukWOLf5dynPLDaZsRvwD5g6";
  const header = {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}`};

  res = await axios.post(url, `message=${message}`, {headers: header});
  return res.status;
});

router.get("/payment-notify", async (req, res) => {
	const date = new Date();
	let day = String(date.getDate()).padStart(2, "0");
	let month = String(date.getMonth() + 1).padStart(2, "0");
	let year = date.getFullYear();
	let currentDate = `${year}-${month}-${day}`;

	res_data = await axios.get(`https://badmintonsystem.onrender.com/api/payment-notify/${currentDate}`);
	res.status(200).json(res_data.data);
});

module.exports = router;
module.exports.getLineName = getLineName;