const neo4j = require('neo4j-driver');
const nconf = require('nconf');
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

const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));
console.log('Connected to neo4j');

const get_invitations = async (req, res) => {
	try {
		let user_id = req.cookies.user_id;
		console.log('In invitations code');
		let acceptor_id = user_id;
		console.log('Checking invitations for', acceptor_id);
		let ans = await pool.query(`
select AppUser.User_ID, AppUser.First_Name, AppUser.Last_Name, AppUser.Roll_Number
from AppUser, Friend
where Friend.Acceptor = $1
and Friend.Sender = AppUser.User_ID
and not Status;
`, [acceptor_id]);
		console.log('Invitations:', ans.rows);
		res.json(ans.rows);
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Edit Profile - Insert SQL query failed" });
		console.log(err.stack);
		return err.stack;
	}
}

const checkArray = (arr, arrays) => {
	try {
		for (let array of arrays) {
			if (arr[0] == array[0] && arr[1] == array[1]) return true;
		}
		return false;
	} catch (err) {
		console.log(err.stack);
		return err.stack;
	}
}

const get_recommendations = async (req, res) => {
	try {
			const session = driver.session()
		let user_id = req.cookies.user_id;
		let ans = await pool.query(`
with linked as (
select Sender as user_id from Friend where Acceptor = $1
union
select Acceptor as user_id from Friend where Sender = $1
union
select User_ID from AppUser where User_ID = $1
),
res as (
select User_ID
from AppUser
except 
select user_id from linked)
select * from res
order by random()
limit 20;
`, [user_id]);
		let wildcard = ans.rows;
		wildcard = wildcard.map((el) => el.user_id);
		console.log('wildcard', wildcard);

		let query = `MATCH p = (n: User {ID: ${user_id}})-[*2]-(m: User)
where not (n)--(m)
UNWIND NODES(p) as nd
WITH p, size(collect(distinct(nd))) as distinctlen, m, size((m)--()) as degree
where distinctlen = length(p) + 1
WITH m, 1.0 * degree / (distinctlen - 1) as factor
WHERE factor >= 1
RETURN distinct m.ID as id, factor
				order by factor desc`;
		let results = await session.run(query);
		results = results.records.map((el) => (el.get('id').low).toString());
		results = results.slice(0, 15);
		console.log('graph', results);

		ans = await pool.query(`
select Sender as user_id from Friend where Acceptor = $1 and not Status
union																									 
select Acceptor as user_id from Friend where Sender = $1 and not Status
`, [user_id]);
		let rem = ans.rows.map((el) => el.user_id);
		results.push.apply(results, wildcard);
		results = results.filter((el, index) => results.indexOf(el) === index);
		results = results.filter((el) => !rem.includes(el));
		results = results.slice(0, 20);
		console.log('final', results);
		ret = []
		for (let result of results) {
			let ans = await pool.query(`
select User_ID, First_Name, Last_Name, Roll_Number 
from AppUser
where User_ID = $1
`, [result]);
			ret.push(ans.rows[0]);
		}
			session.close();
		res.json(ret);
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Message Could not be sent" });
		console.log(err.stack);
	}
}

const get_friends = async (req, res) => {
	console.log('Fetch friends');
	try {
		// let user_id = req.user_id; // TODO
		let user_id = req.cookies.user_id;
		const friends = await pool.query(`with actual_friends as (
			(select friend.acceptor a from friend where friend.accept_time is not null and friend.sender = $1)
			union
			(select  friend.sender a from friend where friend.accept_time is not null  and friend.acceptor = $1)
		)  select first_name, last_name , profile_picture from appuser, actual_friends where  a = appuser.user_id`, [user_id]);
		console.log(friends);
		res.status(200).json({
			status: "success",
			data: {
				friends: friends
			}
		});
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Message Could not be sent" });
		return err.stack;
	}
}

const send_request = async (req, res) => {
	try {
		let sender_id = req.cookies.user_id;
		let acceptor_id = req.body.user_id;
		let sending_time = req.body.time;
		console.log('Sender:', sender_id, 'Acceptor:', acceptor_id);
		pool.query('select sender, acceptor, status from friend where (sender = $1 and acceptor = $2) or (sender = $2 and acceptor = $1);'
			, [sender_id, acceptor_id],
			(err, result) => {
				if (err) {
					res.status(200).json({ "status": "failure", "message": "Query Failed" });
					console.log(err.stack);
				} else {
					if (result.rows.length != 0) {
						res.status(200).json({ "status": "failure", "message": "Request already pending" });
					} else {
						pool.query('insert into friend (sender, acceptor, sending_time, accept_time, status) values ($1, $2, $3, null, false);',
							[sender_id, acceptor_id, sending_time], (err, result) => {
								if (err) {
									res.status(200).json({ "status": "failure", "message": "Could not send request" });
									console.log(err.stack);
								} else {
									res.status(200).json({ "status": "success", "message": "Request Sent" });
								}
							})
					}
				}
			})
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
		console.log(err.stack);
	}
}

const accept_request = async (req, res) => {
	try {
			const session = driver.session();
		let acceptor_id = req.cookies.user_id;
		let sender_id = req.body.user_id;
		let accept_time = req.body.time;
		pool.query('select sender, acceptor, status from friend where sender = $1 and acceptor = $2 and status = false;', [sender_id, acceptor_id],
			(err, result) => {
				if (err) {
					res.status(200).json({ "status": "failure", "message": "Query Failed" });
					console.log(err.stack);
				} else {
					if (result.rows.length == 0) {
						res.status(200).json({ "status": "failure", "message": "No such (pending) request" });
					} else {
						pool.query(`update friend set accept_time = $3, status = true where 
								sender = $1 and acceptor = $2 and status = false;`,
							[sender_id, acceptor_id, accept_time], (err, result) => {
								if (err) {
									res.status(200).json({ "status": "failure", "message": "Could not accept request" });
									console.log(err.stack);
								} else {
									quer = `MATCH (n: User {ID: ${sender_id}}), (m: User {ID: ${acceptor_id}}) CREATE (n)-[:FRIEND]->(m);`
									let ans = session.run(quer);
									res.status(200).json({ "status": "success", "message": "Request Accepted" });
								}
							})
					}
				}
			})
			session.close();
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
		console.log(err.stack);
	}
}

const decline_request = async (req, res) => {
	try {
		let acceptor_id = req.cookies.user_id;
		let sender_id = req.body.user_id;
		let accept_time = req.body.time;
		pool.query('select sender, acceptor, status from friend where sender = $1 and acceptor = $2 and status = false;', [sender_id, acceptor_id],
			(err, result) => {
				if (err) {
					res.status(200).json({ "status": "failure", "message": "Query Failed" });
					console.log(err.stack);
				} else {
					if (result.rows.length == 0) {
						res.status(200).json({ "status": "failure", "message": "No such (pending) request" });
					} else {
						pool.query(`delete from friend where 
								sender = $1 and acceptor = $2`,
							[sender_id, acceptor_id], (err, result) => {
								if (err) {
									res.status(200).json({ "status": "failure", "message": "Could not decline request" });
									console.log(err.stack);
								} else {
									res.status(200).json({ "status": "success", "message": "Request Declined" });
								}
							})
					}
				}
			})
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
		console.log(err.stack);
	}
}

const check_request = async (req, res) => {
	try {
		let user_id = req.cookies.user_id;
		console.log(req.body);
		let other_id = req.body.user_id;
		console.log('Checking for user', user_id, 'and other', other_id);
		let ans = await pool.query(`
select * from friend
where (sender = $1 and acceptor = $2) or (acceptor = $1 and sender = $2 and status) or ($1 = $2)
`, [user_id, other_id]);
		if (ans.rows.length != 0) {
			res.status(200).json({ "status": "success", "message": "already friends" });
		}
		else {
			ans = await pool.query(`
select * from friend
where acceptor = $1 and sender = $2 and not status
`, [user_id, other_id]);
			if (ans.rows.length != 0) {
				res.status(200).json({ "status": "success", "message": "request received" });
			}
			else {
				res.status(200).json({ 'status': 'success', 'message': 'request possible' });
			}
		}
	} catch (err) {
		res.status(200).json({ "status": "failure", "message": "Query Failed" });
		console.log(err.stack);
	}
}
module.exports = {
	get_invitations,
	get_recommendations,
	get_friends,
	send_request,
	accept_request,
	decline_request,
	check_request,
}
