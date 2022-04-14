const Pool = require('pg').Pool;
require('dotenv').config();

var user = process.env.USR;
var host = process.env.HOST;
var database = process.env.DATABASE;
var password = process.env.PASSWORD;
var port = process.env.PORT;

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port
});

const check_login = asyn (req, res) => {
    try {
        const res = await pool.query(
            `
            
            `
        );
        
    } catch (err) {
        return err.stack;
    }
}

