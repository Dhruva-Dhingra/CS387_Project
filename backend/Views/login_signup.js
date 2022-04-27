// const Pool = require('pg').Pool;
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
	console.log('Signing up in backend')
        let email = req.body.email;
		let password = req.body.password;
		let firstname = req.body.firstname;
		let lastname = req.body.lastname;
		lastname = lastname == undefined ? null : lastname;
		let rollno = req.body.rollno;
		let branch = req.body.branch;
		let degree = req.body.degree;
		let batch = req.body.batch;
		// let password = bcrypt.hashSync(req.body.password, 8);
		let residence = req.body.residence;
		residence = residence == undefined ? null : residence;
		let bday = req.body.bday;
		bday = bday == undefined ? null : bday;
		let sgndate = new Date();
		let pfp = req.body.pfp;
		pfp = pfp == undefined ? null : pfp;
		let pvt = req.body.pvt;
		let autoadd = req.body.autoadd;
		
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
					res.status(400).json({"status" : "failure"});
					return console.error('Error executing query', err.stack);
				}
				else{
					res.status(200).json({"status" : "success"});
				}
			}
		);
}

const login = async (req, res) => {
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
				res.status(400).json({"status" : "failure"});
				return console.error('Error executing query', err.stack);
			}
			else{
				if(result.rows.length == 0){
					res.status(400).json({
						accessToken: null,
						message: "User doesn't exist"
					});
				}
				else{
					ans = result.rows[0];
					refpswd = ans['hash_of_password'];
					// var isValid = bcrypt.compareSync(bcrypt.hash(password), refpswd);
					var isValid = (password.localeCompare(refpswd)) == 0;
					if (!isValid) {
						res.status(400).json({
							accessToken: null,
							message: "Invalid Password"
						});
					}
					else {
						var token = jwt.sign({id: ans['user_id']}, config.secret, {
							expiresIn: 86400
						});
						res.status(200).json({
							id: ans['user_id'],
							email: ans['email'],
							accessToken: token,
							message: "Success"
						});
					} 
				}
			}
		}
        );
}

const verifyToken = (token) => {
		let ver = jwt.verify(token, config.secret, (err, verified) => {
				if (err) return false;
				return true;
		});
		console.log(ver);
		return ver;
	}

module.exports = {
    checkIfExists,
    signup,
    login,
		verifyToken,
}
