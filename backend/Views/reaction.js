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
		console.log('liking post');
		var reaction = req.body.reaction;
		reaction = parseInt(reaction);
		var post_id = req.body.post_id;
		post_id = parseInt(post_id);
		let user_id = req.cookies.user_id;
		user_id = parseInt(user_id);
		let time_stamp = req.cookies.time;

		var rightNow = new Date();
		var dateTime = rightNow.toISOString().slice(0, 19).replace("T", " ");
		time = dateTime;
		pool.query(`select * from reaction where user_id = $1 and post_id = $2 and reaction = $3`,
			[user_id, post_id, reaction],
			(err, result) => {
				if (err) {
					res.status(200).json({ "status": "failure", "message": "Query Failed" });
					return console.error('Query Failed', err.stack);
				}
				else {
					if (result.rows.length != 0) {
						res.status(200).json({
							accessToken: null,
							message: "Already Liked this Post",
							status: "failure",
						});
					}
					else {
						pool.query(`
                    insert into reaction values  ($1,$2,$3,$4)`, [user_id, post_id, reaction, time_stamp],
							(err, result) => {
								if (err) {
									res.status(200).json({ "status": "failure", "message": "Query Failed" });
									return console.error('Query Failed', err.stack);
								}
								else {
									console.log("Post Liked");
									res.status(200).json({ "status": "success", "message": "success" });
								}
							}
						);
					}
				}
			}
		);
	} catch (err) {
		console.log(err.stack);
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
	}
}

const remove_reaction_from_post = async (req, res) => {
	try {
		console.log('unliking post');
		var reaction = req.body.reaction;
		reaction = parseInt(reaction);
		var post_id = req.body.post_id;
		post_id = parseInt(post_id);
		let user_id = req.cookies.user_id;
		user_id = parseInt(user_id);
		let time_stamp = req.cookies.time;
		console.log(post_id, user_id);

		pool.query(`select * from reaction where user_id = $1 and post_id = $2 and reaction = $3`,
			[user_id, post_id, reaction],
			(err, result) => {
				if (err) {
					res.status(200).json({ "status": "failure", "message": "Query Failed" });
					return console.error('Query Failed', err.stack);
				}
				else {
					if (result.rows.length == 0) {
						res.status(200).json({
							accessToken: null,
							message: "No reaction on this Post to remove",
							status: "failure",
						});
					}
					else {
						pool.query(`
                    delete from reaction where user_id = $1 and post_id = $2 and reaction = $3`, [user_id, post_id, reaction],
							(err, result) => {
								if (err) {
									res.status(200).json({ "status": "failure", "message": "Query Failed" });
									return console.error('Query Failed', err.stack);
								}
								else {
									res.status(200).json({ "status": "success", "message": "success" });
								}
							}
						);
					}
				}
			}
		);
	} catch (err) {
		console.log(err.stack);
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
	}
}

const get_reaction_count = async (req, res) => {
	try {
		var post_id = req.body.post_id;
		const q1 = pool.query(`
        select  reaction, coalesce(count(distinct User_id),0) from reaction where Post_id = $1 group by Reaction `, [post_id]);
		res.status(200).json({
			data: {
				status: (await q1).rows,
			}
		});
	}
	catch (err) {
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
		console.log(err);
	}
}

const get_single_reaction_count = async (req, res) => {
	try {
		var post_id = req.body.post_id;
		pool.query(`
        select coalesce(count(reaction.reaction), 0) as reaction_count
        from reaction where post_id = $1;`, [post_id], (err, result) => {
			if (err) {
				res.status(200).json({ "status": "failure", "message": "Query Failed" });
				return console.error('Query Failed', err.stack);
			} else {
				res.status(200).json(result.rows);
			}
		});
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
		return console.error('Query Failed', err.stack);
	}
}

module.exports = {
	react_to_post,
	remove_reaction_from_post,
	get_reaction_count,
	get_single_reaction_count,
}