const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const pool = require("../db");
const redirectIfAuth = require("../middleware/redirectIfAuth");

// router.get("/register", redirectIfAuth, (req, res) => {
// 	const validationErrors = req.flash("validationErrors");

// 	res.render("auth/register", {
// 		errors: validationErrors,
// 	});
// });

// router.post("/register", redirectIfAuth, async (req, res) => {
// 	try {
// 		const { username, password } = req.body;
// 		const passwordHash = await bcrypt.hash(password, 10);
// 		const newUser = await pool.query(
// 			"INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING *",
// 			[username, passwordHash, true]
// 		);
//     req.session.userID = newUser.rows[0].user_id;
// 		return res.redirect("/auth/login");
// 	} catch (err) {
// 		switch (err.code) {
// 			case "22001":
// 				req.flash("validationErrors", "Username too long!");
// 				break;
// 			case "23505":
// 				req.flash("validationErrors", "Username already used!");
// 				break;
// 			default:
// 				console.error(err);
// 		}
// 		res.redirect("/auth/register");
// 	}
// });

router.get("/login", redirectIfAuth, (req, res) => {
	const validationErrors = req.flash("validationErrors");

  let username = "";
  let password = "";
  let data = req.flash("data")[0];

  if (typeof data != "undefined") {
    username = data.username;
    password = data.password;
  }

	res.render("auth/login", {
		errors: validationErrors,
    username,
    password
	});
});

router.post("/login", redirectIfAuth, async (req, res) => {
	const { username, password } = req.body;
	let user = await pool.query("SELECT * FROM users WHERE username = $1", [
		username,
	]);
	user = user.rows[0];
	if (user) {
		let cmp = bcrypt.compare(password, user.password).then((match) => {
			if (match) {
				req.session.userID = user.user_id;
				res.redirect("/");
			} else {
				req.flash("validationErrors", "Password Incorrect!");
        req.flash("data", req.body)
				res.redirect("/auth/login");
			}
		});
	} else {
		req.flash("validationErrors", "Username Not Found!");
    req.flash("data", req.body)
		res.redirect("/auth/login");
	}
});

router.get("/logout", (req, res) => {
	req.session.destroy(() => {
		res.redirect("/");
	});
});

module.exports = router;
