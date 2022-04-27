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

console.log('Pool made');

const insert_users = async () => {
		for (let i = 1; i <= 9; i++) {
				let ans = await pool.query(`
insert into AppUser (Email, Hash_of_Password)
values ($1, $2)
`, [`u${i}@s.c`, `u${i}`]);
				console.log('Inserted', i);
		}
}

const insert_friends = async () => {
		let friends = [
				[1, 2],
				[4, 2],
				[5, 2],
				[3, 1],
				[6, 3],
				[7, 6],
				[8, 6],
				[8, 9],
				[6, 9]
		]
		for (let friend_pair of friends) {
				let ans = await pool.query(`
insert into Friend (Sender, Acceptor, Status)
values ($1, $2, TRUE)
`, [friend_pair[0], friend_pair[1]]);
				console.log('Inserted', friend_pair);
		}
}

// insert_users();
insert_friends();
