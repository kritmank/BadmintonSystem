const Pool = require("pg").Pool;

const pool = new Pool({
	user: "postgres",
	password: "DATABASE_PASSWORD",
	host: "DATABASE_HOST",
	port: 5432,
	database: "DATABASE_NAME",
});

module.exports = pool;
