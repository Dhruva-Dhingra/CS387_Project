const Pool = require('pg').Pool;
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


const get_timeline = async (req, res) => {
	try {
		let user_id = req.params.user;
		if (user_id === undefined) {
			user_id = 10;
		}
		console.log("log request ", req.body);
		console.log(req.body.start, req.body.end);
		let start = req.body.start === undefined ? 1 : req.body.start;
		let end = req.body.end === undefined ? 20 : req.body.end;
		console.log(user_id, start, end);
		if (start < 0 || end < 0) {
			res.status(200).json({ "status": "failure", "message": "start or end < 0" });
		}
		pool.query(
			// `select post_info.post_id, post_info.poster_page_id, post_info.poster_user_id, post_info.content_type, post_info.content, post_info.time, coalesce(reaction_count.reaction_count, 0)
			// from 
			// (select Post.Post_id, Post.Page_ID as poster_page_id, Post.User_ID as poster_user_id, Post.Content_Type, Post.Content, Post.Time, row_number() over (Partition By Post.User_ID order by Post.Time desc) as Post_Rank
			//     from Post where Post.User_ID = $1
			// ) as post_info left outer join reaction_count
			// on post_info.post_rank between $2 and $3 and (post_info.post_id = reaction_count.post_id or reaction_count.post_id is null);`,
			`
            with post_info_2 as (select post_info.post_id as post_id, post_info.poster_page_id as page_id, post_info.poster_user_id as user_id, post_info.content_type as content_type, post_info.content as content, post_info.time as time, post_rank, coalesce(count(reaction.reaction), 0) as reaction_count
            from (
                select post_id, page_id as poster_page_id, user_id as poster_user_id, content_type, content, time, row_number() over (order by time DESC) as post_rank
                from post
                where
                Post.User_ID = $1
            ) as post_info left outer join reaction
            on post_info.post_rank between $2 and $3 and (post_info.post_id = reaction.post_id or reaction.post_id is null)
            group by (post_info.post_id, post_info.poster_page_id, post_info.poster_user_id, post_info.content_type, post_info.content, post_info.time, post_rank)),
		    user_info as (select user_id, first_name, last_name, roll_number, branch, degree, batch, email, residence, profile_picture, birthday, signup_date from appuser where user_id = $1) 
            select post_info_2.post_id as post_id, post_info_2.page_id as page_id, post_info_2.user_id as user_id, first_name, last_name, roll_number, branch, degree, batch, email, residence, profile_picture, birthday, signup_date, post_info_2.content_type as content_type, post_info_2.content as content, post_info_2.time as time, post_info_2.reaction_count
            from (post_info_2 join user_info
            on post_info_2.user_id = user_info.user_id) WHERE post_rank BETWEEN $2 AND $3 order by time DESC
		    ;`,
			[user_id, start, end],
			(err, result) => {
				if (err) {
					res.status(200).json({ "status": "failure", "message": "SQL query failed" });
					return console.error('Error executing query', err.stack);
				}
				else {
					res.status(200).json({ "status": "success", "result": result.rows, "rowCount": result.rowCount });
				}
			}
		);
	}
	catch (err) {
		res.status(200).json({ "status": "failure", "message": "SQL query failed" });
		return err.stack;
	}
}

const get_about = async (req, res) => {
	try {
		let user_id = req.params.user;
		await pool.query(`
select *
from AppUser
where user_id = $1
`, [user_id], (err, result) => {
			if (err) {
				res.status(200).json({ "status": "failure", "message": "SQL query failed" });
				return console.error('Error executing query', err.stack);
			}
			else {
				res.status(200).json({ "status": "success", "result": result.rows, "rowCount": result.rowCount });
			}
		});
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "SQL query failed" });
		console.log(err.stack);
	}
}


module.exports = {
	get_timeline,
	get_about,
}