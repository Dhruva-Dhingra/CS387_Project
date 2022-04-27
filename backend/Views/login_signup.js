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


console.log(user, host, database, password, port);

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
				let res = await pool.query(
						`
select *
from AppUser
where Email = $1
`, [email]
				);
				console.log('here');
				console.log(res.rows);
				if (res.rows.length != 0) {
						console.log("User already exists");
						return true;
				}
				console.log("User doesn't already exist");
				return false;
    } catch (err) {
				return err.stack;
    }
}

const signup = async (req, res) => {
		console.log('Signing up in backend')
    try {
        let email = req.body.email;
				// let firstname = req.body.firstname;
				// let lastname = req.body.lastname;
				// let rollno = req.body.rollno;
				// let branch = req.body.branch;
				// let degree = req.body.degree;
				// let batch = req.body.batch;
				// let password = bcrypt.hashSync(req.body.password, 8);
				let password = req.body.password;
				// let residence = req.body.residence;
				// let bday = req.body.bday;
				// let sgndate = new Date();
				// let pfp = req.body.pfp;
				// let pvt = req.body.pvt;
				// let autoadd = req.body.autoadd;

// 				let ans = await pool.query(
// 						`
// insert into AppUser (First_Name, Last_Name, Roll_Number, Branch, Degree, Batch
// Email, Hash_of_Password, Residence, Birthday, SignUp_Date,
// Profile_Picture, Private, AutoAdd_to_Groups)
// values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
// `,
// 						[firstname, lastname, rollno, branch, degree, batch, email, password,
// 						 residence, bday, sgndate, pfp, pvt, autoadd]
// 				);
				let ans = await pool.query(
						`
insert into AppUser (Email, Hash_of_Password)
values ($1, $2)
`,
						[email, password]
				);
    } catch (err) {
				return err.stack;
    }
}

const login = async (req, res) => {
		console.log('Trying to login in backend');
    try {
				email = req.body.email;
				password = req.body.password;
        const user_details = await pool.query(
						`
select *
from AppUser
where Email = $1
`, [email]
        );
				// if (user_details.rows.length == 0) res.status(401).send({
				// 		accessToken: null,
				// 		message: "User doesn't exist"
				// });
				if (user_details.rows.length == 0) return {
					accessToken: null,
					message: "User doesn't exist"
				};
				ans = user_details.rows[0];
				refpswd = ans['hash_of_password'];
				console.log(ans);
				// var isValid = bcrypt.compareSync(bcrypt.hash(password), refpswd);
				var isValid = (password.localeCompare(refpswd)) == 0;
				console.log(password, '==', refpswd)
				console.log('isValid:', isValid);
				if (!isValid) {
						console.log('Invalid password');
						return {
								accessToken: null,
								message: 'Invalid Password'
						};
				}
				else {
						console.log('Valid password');
						var token = jwt.sign({id: ans['user_id']}, config.secret, {
								expiresIn: 86400
						});
						console.log(token);
						return {
								id: ans['user_id'],
								email: ans['email'],
								accessToken: token,
						};
				} 
    } catch (err) {
        return err.stack;
    }
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
