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
		console.log("Create Post");
		let page_id = req.body.page_id;
		page_id = page_id == undefined ? null : parseInt(page_id);
		let user_id = parseInt(req.cookies.user_id);
		user_id = user_id == undefined ? null : parseInt(user_id);
		let content_type = 0;
		// content_type = content_type == undefined ? null : parseInt(content_type);
		let content = req.body.content;
		content = content == undefined ? null : content
		let time = req.body.time;
		let validity = 1;
		console.log("OK")
		console.log([page_id, user_id, content_type, content, time, validity]);
		console.log("Starting query execution");
		pool.query(
			`insert into Post(Page_ID, User_ID, Content_Type, Content, Time, Validity)
            values
            ($1, $2, $3, $4, $5, $6)`,
			[page_id, user_id, content_type, content, time, validity],
			(err, result) => {
				if (err) {
					console.log(err.stack);
					res.status(200).json({ "status": "failure", "message": "Insert SQL query failed" });
					return console.error('Error executing query', err.stack);
				}
				else {
					console.log("Added post");
					res.status(200).json({ "status": "success", "message": "Post Created" });
				}
			}
		);
	}
	catch (err) {
		console.log(err.stack)
		res.status(200).json({ "status": "failure", "message": "Message Could not be sent" });
		return err.stack;
	}
}


module.exports = {
	create_post,
}