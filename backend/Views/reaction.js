const Pool = require('pg').Pool;
const bcrypt = require('bcrypt')
const config = require('../config/auth.config')
require('dotenv').config();

var user = process.env.USR;
var host = process.env.HOST;
var database = process.env.DATABASE;
var password = process.env.PASSWORD;
var port = process.env.PORT;


console.log(user, host, database, password, port);

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port
});

console.log('Pool made');

const react_to_post = async (req, res) => {
    try {
        var reaction = req.body.reaction;
        var post_id = req.body.post_id;
		let user_id = req.cookies.user_id;
        let time_stamp = new Date();
        const q1 = pool.query(`
        insert into reaction values  ($1,$2,$3,$4)`, [user_id, post_id,reaction, time_stamp]);
        res.status(200).json({
            data: {
                status:  (await q1),
            }
        });
    }
    catch (err){
        console.log(err)
    }
}


module.exports = {
   react_to_post,
}
