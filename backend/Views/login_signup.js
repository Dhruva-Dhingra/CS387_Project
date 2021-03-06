const neo4j = require('neo4j-driver');
const nconf = require('nconf');
const Pool = require('pg').Pool;
const jwt = require('jsonwebtoken')
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

console.log('Pool made');

const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));
console.log('Connected to neo4j');

const checkIfExists = async (email) => {
	console.log('Checking if user exists');
	try {
		var res;
		res = await pool.query(
			`
			select *
			from AppUser
			where Email = $1
			`, [email]
		);
		// console.log("Res = ", res);
		if (res.rows.length != 0) {
			console.log("User already exists");
			return true;
		}
		console.log("User doesn't already exist");
		return false;
	}
	catch (err) {
		return err.stack;
	}
}

const signup = async (req, res) => {
	try {
		let email = req.body.email;
		let password = req.body.hash_of_password;
		let firstname = req.body.first_name;
		let lastname = req.body.last_name;
		lastname = lastname == undefined ? null : lastname;
		let rollno = req.body.roll_number;
		let branch = req.body.branch;
		let degree = req.body.degree;
		let batch = req.body.batch;
		// let password = bcrypt.hashSync(req.body.password, 8);
		let residence = req.body.residence;
		residence = residence == undefined ? null : residence;
		let bday = req.body.birthday;
		bday = bday == undefined ? null : bday;
		let sgndate = new Date();
		let pfp = req.body.profile_picture;
		pfp = pfp == undefined ? null : pfp;
		let pvt = false;
		let autoadd = true;

		try {
				const session = driver.session();
			pool.query(
				`
				insert into AppUser (First_Name, Last_Name, Roll_Number, Branch, Degree, Batch,
				Email, Hash_of_Password, Residence, Birthday, SignUp_Date,
				Profile_Picture, Private, AutoAdd_to_Groups)
				values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
				`,
				// `
				// insert into AppUser (Email, Hash_of_Password)
				// values ($7, $8)
				// `,
				[firstname, lastname, rollno, branch, degree, batch, email, password,
					residence, bday, sgndate, pfp, pvt, autoadd],
				(err, result) => {
					if (err) {
						res.status(200).json({ "status": "failure" });
						return console.error('Error executing query', err.stack);
					}
					else {
						quer = `CREATE (n: User {ID: ${user}});`;
						let ans = session.run(quer);
						res.status(200).json({ "status": "success" });
					}
				}
			);
				session.close();
		} catch (err) {
			res.status(200).json({ "status": "failure" });
			console.log(err.stack)
		}
	} catch (err) {
		res.status(200).json({ "status": "failure" });
		console.log(err.stack);
	}
}

const login = async (req, res) => {
	try {
		email = req.body.email;
		password = req.body.password;
		pool.query(
			`
			select *
			from AppUser
			where Email = $1
			`, [email],
			(err, result) => {
				if (err) {
					res.status(200).json({ "status": "failure" });
					return console.error('Error executing query', err.stack);
				}
				else {
					if (result.rows.length == 0) {
						res.status(200).json({
							accessToken: null,
							message: "User doesn't exist",
							status: "failure",
						});
					}
					else {
						ans = result.rows[0];
						refpswd = ans['hash_of_password'];
						// var isValid = bcrypt.compareSync(bcrypt.hash(password), refpswd);
						var isValid = (password.localeCompare(refpswd)) == 0;
						if (!isValid) {
							res.status(200).json({
								message: "Invalid Password",
								status: "failure",
							});
						}
						else {
							var token = jwt.sign({ id: ans['user_id'] }, config.secret, {
								expiresIn: 86400
							});
							res.cookie('accessToken', token);
							res.cookie('user_id', ans['user_id']);
							res.status(200).json({
								email: ans['email'],
								message: "Success"
							});
						}
					}
				}
			}
		);
	} catch (err) {
		res.status(200).json({ "status": "failure" });
		console.log(err.stack);
	}
}

const logout = (req, res) => {
	try {
		res.clearCookie('accessToken');
		res.clearCookie('user_id');
		res.json({ 'status': 'cleared' });
	} catch (err) {
		res.status(200).json({ "status": "failure" });
		console.log(err.stack);
	}
}

const verifyToken = (token, user_id) => {
	try {
		let ver = jwt.verify(token, config.secret);
		return ver.id == user_id;
	} catch (err) {
		console.log(err.stack);
		return err.stack;
	}
}

module.exports = {
	checkIfExists,
	signup,
	login,
	logout,
	verifyToken,
}
