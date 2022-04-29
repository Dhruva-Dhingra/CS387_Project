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
const session = driver.session();

const get_invitations = async (req, res) => {
		try {
				let user_id = req.cookies.user_id;
				console.log('In invitations code');
				let acceptor_id = user_id;
				console.log('Checking invitations for', acceptor_id);
				let ans = await pool.query(`
-- select AppUser.User_ID, AppUser.First_Name, AppUser.Last_Name, AppUser.Roll_Number
select AppUser.User_ID
from AppUser, Invitations
where Invitations.Sender = AppUser.User_ID
and Invitations.Acceptor = $1;
`, [acceptor_id]);
				console.log(ans.rows);
				return ans.rows;
		} catch (err) {
				return err.stack;
		}
}

const checkArray = (arr, arrays) => {
		for (let array of arrays) {
				if (arr[0] == array[0] && arr[1] == array[1]) return true;
		}
		return false;
}

const sync_node = async() => {
		try {
				let user_arr = await pool.query(`
select User_ID from AppUser
`);
				user_arr = user_arr.rows;
				user_arr = user_arr.map((el) => el.user_id);
				console.log(user_arr);

				let friend_arr = await pool.query(`
select Sender, Acceptor from Friend
`);
				friend_arr = friend_arr.rows;
				friend_arr = friend_arr.map((el) => JSON.stringify(el));
				console.log(friend_arr);
				return {'user_arr': user_arr, 'friend_arr': friend_arr};
		} catch (err) {
				return err.stack;
		}
}
const sync_graphdb = async (user_arr, friend_arr) => {
		try {
				console.log('Here in syncing function');
				let user_ans = await pool.query(`select User_ID from AppUser;`)
				console.log('Got response from SQL server');
				user_ans = user_ans.rows.map((el) => el.user_id);
				user_diff = user_ans.filter((el) => !user_arr.includes(el));
				console.log('New users:', user_diff);
				let queries = [];
				for (let user of user_diff) {
						queries.push(`CREATE (n: User {ID: ${user}});`);
				}
				console.log("User queries inserted");
				let friend_ans = await pool.query(`
select Sender, Acceptor
from Friend
where Status  
`);
				friend_ans = friend_ans.rows.map((el) => JSON.stringify(el));
				friend_diff = friend_ans.filter((el) => friend_arr.indexOf(el) == -1);
				for (let friend of friend_diff) {
						friend = JSON.parse(friend);
						queries.push(`MATCH (n: User {ID: ${friend.sender}}), (m: User {ID: ${friend.acceptor}}) CREATE (n)-[:FRIEND]->(m);`)
				}
				console.log(queries.length);
				let i = 0;
				for (let query of queries) {
						console.log(i);
						let res = await session.run(query);
						i += 1;
				}
				console.log('Syncing done');
				let result = {
						'user_arr': user_ans, 'friend_arr': friend_ans
				};
				res.json(result);
		} catch (err) {
				return err.stack;
		}
}

const get_recommendations = async (req, res) => {
		try {
				let user_id = req.cookies.user_id;
				console.log('Getting recommendations for', user_id);
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
				console.log('wildcard:', wildcard);

				let query = `MATCH p = (n: User {ID: ${user_id}})-[*2..3]-(m: User)
UNWIND NODES(p) as nd
WITH p, size(collect(distinct(nd))) as distinctlen, m, size((m)--()) as degree
where distinctlen = length(p) + 1
WITH m, 1.0 * degree / (distinctlen - 1) as factor
WHERE factor >= 1
RETURN m.ID as id, factor
order by factor desc`;
				let res = await session.run(query);
				res = res.records.map((el) => (el.get('id').low).toString());
				console.log('Recommendations:', res)

				ans = await pool.query(`
select Sender as user_id from Friend where Acceptor = $1 and not Status
union																									 
select Acceptor as user_id from Friend where Sender = $1 and not Status
`, [user_id]);
				let rem = ans.rows.map((el) => el.user_id);
				res.push.apply(res, wildcard);
				console.log('Result:', res);
				res = res.filter((el, index) => res.indexOf(el) === index);
				res = res.filter((el) => !rem.includes(el));
				res = res.slice(0, 20);
				ret = []
				for (let result of res) {
						console.log('Result int:', result);
						let ans = await pool.query(`
select AppUser.User_ID
from AppUser
where User_ID = $1
`, [result]);
						console.log('Answer:', ans.rows);
						ret.push(ans.rows[0]);
				}
				console.log(ret);
				res.json(ret);
		} catch (err) {
				res.status(200).json({"status" : "failure", "message" : "Message Could not be sent"});
				return err.stack;
		}
}

const get_friends  = async (req, res) => {
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
								friends : friends
            }     
        });
	  } catch (err) {
				res.status(200).json({"status" : "failure", "message" : "Message Could not be sent"});
        return err.stack;
    }
}

const reset_graph = async () => {
		try {
				let query = 'MATCH (n: User) detach delete n;';
				let res = await session.run(query);
				return res;
		} catch (err) {
				return err.stack;
		}
}

const send_request = async (req, res) => {
		try {
				let sender_id = req.cookies.user_id;
				let acceptor_id = req.body.user_id;
				let sending_time = req.body.time;
				pool.query('select sender, acceptor, status from friend where (sender = $1 and acceptor = $2) or (sender = $2 and acceptor = $1);'
									 , [sender_id, acceptor_id],
									 (err, result) => {
											 if(err){
													 res.status(200).json({"status" : "failure", "message" : "Query Failed"});
													 console.log(err.stack);
											 } else {
													 if(result.rows.length != 0){
															 res.status(200).json({"status" : "failure", "message" : "Request already pending"});
													 } else {
															 pool.query('insert into friend (sender, acceptor, sending_time, accept_time, status) values ($1, $2, $3, null, false);',
																					[sender_id, acceptor_id, sending_time], (err, result) => {
																							if(err){
																									res.status(200).json({"status" : "failure", "message" : "Could not send request"});
																									console.log(err.stack);
																							} else {
																									res.status(200).json({"status" : "success", "message" : "Request Sent"});
																							}
																					})
													 }
											 }
									 })
		} catch (err){
				res.status(200).json({"status" : "failure", "message" : "Query Failed"});
				console.log(err.stack);
		}
}

const accept_request = async (req, res) => {
		try {
				let acceptor_id = req.cookies.user_id;
				let sender_id = req.body.user_id;
				let accept_time = req.body.time;
				pool.query('select sender, acceptor, status from friend where sender = $1 and acceptor = $2 and status = false;', [sender_id, acceptor_id],
									 (err, result) => {
											 if(err){
													 res.status(200).json({"status" : "failure", "message" : "Query Failed"});
													 console.log(err.stack);
											 } else {
													 if(result.rows.length == 0){
															 res.status(200).json({"status" : "failure", "message" : "No such (pending) request"});
													 } else {
															 pool.query(`update friend set accept_time = $3, status = true where 
								sender = $1 and acceptor = $2 and status = false;`,
																					[sender_id, acceptor_id, accept_time], (err, result) => {
																							if(err){
																									res.status(200).json({"status" : "failure", "message" : "Could not accept request"});
																									console.log(err.stack);
																							} else {
																									res.status(200).json({"status" : "success", "message" : "Request Accepted"});
																							}
																					})
													 }
											 }
									 })
		} catch (err){
				res.status(200).json({"status" : "failure", "message" : "Query Failed"});
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
											 if(err){
													 res.status(200).json({"status" : "failure", "message" : "Query Failed"});
													 console.log(err.stack);
											 } else {
													 if(result.rows.length == 0){
															 res.status(200).json({"status" : "failure", "message" : "No such (pending) request"});
													 } else {
															 pool.query(`delete from friend where 
								sender = $1 and acceptor = $2`,
																					[sender_id, acceptor_id, accept_time], (err, result) => {
																							if(err){
																									res.status(200).json({"status" : "failure", "message" : "Could not decline request"});
																									console.log(err.stack);
																							} else {
																									res.status(200).json({"status" : "success", "message" : "Request Declined"});
																							}
																					})
													 }
											 }
									 })
		} catch (err){
				res.status(200).json({"status" : "failure", "message" : "Query Failed"});
				console.log(err.stack);
		}
}

module.exports = {
		get_invitations,
		sync_node,
		sync_graphdb,
		get_recommendations,
		get_friends,
		reset_graph,
		send_request,
		accept_request,
		decline_request,
}
