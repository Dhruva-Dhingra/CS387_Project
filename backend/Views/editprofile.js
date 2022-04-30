const Pool = require('pg').Pool;
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

const edit_profile = async (req, res) => {
		// incomplete
		try {
				let user_id = req.cookies.user_id
				let first = req.body.first_name;
				first = first == undefined ? null : first
				let last = req.body.last_name;
				last = last == undefined ? null : last
				let rolln = req.body.roll_number;
				rolln = rolln == undefined ? null : rolln;
				let branch = req.body.branch;
				branch = branch == undefined ? null : branch;
				let degree = req.body.degree;
				degree = degree == undefined ? null : degree;
				let batch = req.body.batch;
				batch = batch == undefined ? null : parseInt(batch);
				let email = req.body.email;
				email = email == undefined ? null : email;
				let pswd = req.body.hash_of_password
				pswd = pswd == undefined ? null : pswd;
				let residence = req.body.residence;
				residence = residence == undefined ? null : residence;
				let bday = req.body.birthday;
				bday = bday == undefined ? null : new Date(bday) // TODO
				let dp = req.body.profile_picture;
				dp = dp == undefined ? null : dp
				let pvt = req.body.private;
				pvt = pvt == undefined ? null : pvt //TODO
				let autoadd = req.body.autoadd_to_groups;
				autoadd = autoadd == undefined ? null : autoadd

				console.log(first, last, rolln, branch, degree, batch, email, pswd, residence, bday, pvt, autoadd)

				pool.query(
						`UPDATE AppUser
            SET (First_Name, Last_Name, Roll_Number, Branch, Degree, Batch, Email, Hash_of_Password, Residence, Birthday, Profile_Picture, Private, AutoAdd_to_Groups) =
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) where User_ID = $14`,
						[first, last, rolln, branch, degree, batch, email, pswd, residence, bday, dp, pvt, autoadd, user_id],
						(err, result) => {
								if (err) {
										res.status(200).json({ "status": "failure", "message": "Edit Profile - Insert SQL query failed" });
										return console.error('Error executing query', err.stack);
								}
								else {
										res.status(200).json({ "status": "success", "message": "Profile edited successfully" });
								}
						}
				);
		}
		catch (err) {
				res.status(200).json({ "status": "failure", "message": "Edit Profile - Insert SQL query failed" });
				console.log(err.stack);
				return err.stack;
		}
}

const get_profile_info = async (req, res) => {
		// incomplete
		try {
				let user_id = req.cookies.user_id;
				console.log("User id %s", user_id)

				pool.query(
						`select  * from AppUser where User_ID = $1;`, [user_id],
						(err, result) => {
								if (err) {
										res.status(200).json({ "status": "failure", "message": "Get Profile Info failed" });
										return console.error('Error executing query', err.stack);
								}
								else {
										console.log(result.rows[0]);
										res.status(200).json({ "status": "success", "message": "get Profile info query successful", "data": result.rows[0] });
								}
						}
				);
		}
		catch (err) {
				res.status(200).json({ "status": "failure", "message": "Edit Profile - Insert SQL query failed" });
				console.log(err.stack);
				return err.stack;
		}
}

module.exports = {
		edit_profile,
		get_profile_info,
}
