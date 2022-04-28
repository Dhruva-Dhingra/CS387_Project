const Pool = require('pg').Pool;
const bcrypt = require('bcrypt')
const config = require('../config/auth.config')
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

const create_post = async (req, res) => {
    try {
        let page_id = req.body.page_id;
        page_id = page_id == undefined ? null : parseInt(page_id);
        let user_id = parseInt(req.body.user_id);
        user_id = user_id == undefined ? null : parseInt(user_id);
        let content_type = parseInt(req.body.content_type);
        content_type = content_type == undefined ? null : parseInt(content_type);
        let content = req.body.content;
        content = content == undefined ? null : content
        let time = req.body.time;
        let validity = 1;

        pool.query(
            `insert into Post(Page_ID, User_ID, Content_Type, Content, Time, Validity)
            values
            ($1, $2, $3, $4, $5, $6)`,
            [page_id, user_id, content_type, content, time, validity],
			(err, result) => {
				if (err) {
					res.status(200).json({"status" : "failure", "message" : "Insert SQL query failed"});
					return console.error('Error executing query', err.stack);
				}
				else{
                    res.status(200).json({"status" : "success", "message" : "Post Created"});
				}
			}
        );
    }
    catch (err) {
		return err.stack;
    }
}

			
module.exports = {
   create_post,
}
