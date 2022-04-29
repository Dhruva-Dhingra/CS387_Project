const neo4j = require('neo4j-driver');
const nconf = require('nconf');
require('dotenv').config();

const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));
console.log('Connected to neo4j');
const session = driver.session();

const clear = async() => {
		try {
				query = `match (n: User) detach delete n;`;
				let res = await session.run(query);
				console.log('Cleared');
		} catch(err) {
				console.log(err).stack;
		}
}
const load_users = async () =>  {
		try {
		for (let i = 1; i <= 4039; i++) {
				console.log('User', i);
				query = `CREATE (n: User {ID: ${i}})`;
				let res = await session.run(query);
		}
		console.log('All users inserted');
		} catch (err) {
				console.log(err.stack);
		}
}

const load_friends = async () => {
		try {
				console.log('Inserting friends');
query = `load csv with headers from "file:///Friend.csv" as row
match (n1: User {ID: toInteger(row.Sender)}), (n2: User {ID: toInteger(row.Acceptor)})
create (n1)-[:FRIEND]->(n2)`
		let res = await session.run(query);
		console.log('All friends inserted');
		} catch (err) {
				console.log(err.stack);
		}
}

const run = async () => {
		await clear();
		await load_users();
		await load_friends();
}

run();
