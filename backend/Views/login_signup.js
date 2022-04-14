const Pool = require('pg').Pool;
const config = require('../config/auth.config')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
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

const auto_user_id = async () => {
    try {
	let len = await pool.query(
	    `
        select count(*) from AppUser;
        `
	);
	len = len.rows[0].count;
	let quer = pool.query(
	    `
	    create sequence if not exists inc
        start with {$len}
        increment by 1;
        alter table AppUser
        alter column User_ID
        set default nextval('inc')
        `);
    } catch (err) {
	return err.stack;
    }
}

const checkIfExists = async (req, res, next) => {
    try {
	email = req.body.email;
	let res = await pool.query(
	    `
        select *
        from AppUser
        where Emaill = $1
        `, [email]
	);
	if (res.rows.length == 0) return true;
	return false;
    } catch (err) {
		return err.stack;
	}
}


const signup = async (req, res) => {
    try {
        let email = req.body.email;
		let firstname = req.body.firstname;
		let lastname = req.body.lastname;
		let rollno = req.body.rollno;
		let branch = req.body.branch;
		let degree = req.body.degree;
		let batch = req.body.batch;
		let password = bcrypt.hashSync(req.body.password, 8);
		let residence = req.body.residence;
		let bday = req.body.bday;
		let sgndate = new Date();
		let pfp = req.body.pfp;
		let pvt = req.body.pvt;
		let autoadd = req.body.autoadd;

		let ans = await pool.query(
		    `
 	        insert into AppUser (First_Name, Last_Name, Roll_Number, Branch, Degree, Batch
 	                             Email, Hash_of_Password, Residence, Birthday, SignUp_Date,
 	                             Profile_Picture, Private, AutoAdd_to_Groups)
 	        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
 	        `,
		 [firstname, lastname, rollno, branch, degree, batch, email, password,
		  residence, bday, sgndate, pfp, pvt, autoadd]
		)
    } catch (err) {
	return err.stack;
    }
}

const login = async (req, res) => {
    try {
	email = req.body.email;
	password = bcrypt.hashSync(req.body.password, 8);
        const res = await pool.query(
	    `
        select *
        from AppUser
        where email = $1
        `, [email]
        );
	if (res.rows.length == 0) res.status(401).send({
	    accessToken: null,
	    message: "User doesn't exist"
	});
	ans = res.rows[0];
	refpswd = ans['Hash_of_Password'];
	var isValid = bcrypt.compareSync(password, refpswd);
	if (!isValid) res.status(401).send({
	    accessToken: null,
	    message: 'Invalid Password'
	});
	var token = jwt.sign({id: ['User_ID']}, config.secret, {
	    expiresIn: 86400
	});
	res.status(200).send({
	    id: ans['User_ID'],
	    email: ans['Email'],
	    accessToken: token
	});
        
    } catch (err) {
        return err.stack;
    }
}

module.exports = {
    checkIfExists,
    signup,
    login
}
