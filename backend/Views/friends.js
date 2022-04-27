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

const get_invitations = async (user_id) => {
		try {
				let acceptor_id = user_id
				let ans = await pool.query(`
select AppUser.User_ID, AppUser.First_Name, AppUser.Last_Name, AppUser.Roll_Number
from AppUser, Invitations
where Invitations.Sender = AppUser.User_ID
and Invitations.Acceptor = ${acceptor_id};
`
				);
				console.log(ans.rows);
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
						console.log('User', user);
						queries.push(`CREATE (n: User {ID: ${user}});`);
				}
				console.log("New users' queries done");
				let friend_ans = await pool.query(`
select Sender, Acceptor
from Friend
where Status  
`);
				friend_ans = friend_ans.rows.map((el) => [el.sender, el.acceptor]);
				console.log('GraphDB sync:', queries);
				friend_diff = friend_ans.filter((el) => !friend_arr.includes(el));
				console.log('New friends:', friend_diff);
				for (let friend of friend_diff) {
						queries.push(`MATCH (n: User {ID: ${friend[0]}}), (m: User {ID: ${friend[1]}}) CREATE (n)-[:FRIEND]->(m);`)
				}
				for (let query of queries) {
						let res = await session.run(query);
				}
				console.log('Syncing done');
				let result = {
						'user_arr': user_ans, 'friend_arr': friend_ans
				};
				return result;
		} catch (err) {
				return err.stack;
		}
}

const get_recommendations = async (user_id) => {
		try {
				console.log('Getting recommendations!');
				let ans = await pool.query(`
with linked as (
select Sender from Friend where Acceptor = ${user_id}
union
select Acceptor from Friend where Sender = ${user_id}
)
select User_ID
from AppUser
where User_ID not in linked
order by random()
limit 10;
`);
				console.log('SQL query run');
				let wildcard = ans.rows();
				console.log(wildcard);

				query = `MATCH p = (n: User {id: 1})-[*2..3]-(m: User)
UNWIND NODES(p) as nd
WITH p, size(collect(distinct(nd))) as distinctlen, m, size((m)--()) as degree
where distinctlen = length(p) + 1
WITH m, 1.0 * degree / (distinctlen - 1) as factor
WHERE factor >= 1.5
RETURN m.id, factor
order by factor desc`;
				let res = await session.run(query);
				console.log(res.records);

		} catch (err) {
				return err.stack;
		}
}
		
const get_friends  = async (req, res) => {
	console.log('Fetch friends');
	try {
		// let user_id = req.user_id; // TODO
		let user_id = req.cookies.user_id;
		const friends = await db.query(`with actual_friends as (
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
        return err.stack;
    }
}

module.exports = {
		get_invitations,
		sync_graphdb,
		get_recommendations,
		get_friends,
}
