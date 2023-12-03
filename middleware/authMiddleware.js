const pool = require('../db');

module.exports = async (req, res, next) => {
    try {
        let user = await pool.query("SELECT * FROM users WHERE user_id = $1", [req.session.userID]);
        user = user.rows[0];
        if (!user) {
            return res.redirect("/auth/login");
        }
        console.log(user);
        next();
    } catch (err) {
        console.error(err.message);
    }
}