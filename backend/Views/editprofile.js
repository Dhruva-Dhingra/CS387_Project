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
        let first = req.body.first;
        first = first == undefined ? null : first 
        let last = req.body.last;
        last = last == undefined ? null : last
        let rolln =  req.body.rolln;
        rolln =  rolln == undefined? null : rolln;
        let branch =req.body.branch;
        branch = branch == undefined? null : branch;
        let degree =req.body.degree
        degree = degree == undefined? null : degree;
        let batch = req.body.batch
        batch = batch == undefined? null : batch;
        let email = req.body.email
        email = email == undefined? null : email;
        let pswd = req.body.pswd
        pswd = pswd == undefined? null: email;
        let residence = req.body.residenc
        residence = residence == undefined? null : residence;
        let bday = req.body.bday
        bday = bday == undefined? null :bday
        let dp = req.body.dp
        dp = dp == undefined? null : dp
        let private = req.body.hidden
        private = private == undefined? null : private
        let autoadd = req.body.autoadd
        autoadd = autoadd == undefined ? null : autoadd

        pool.query(
            `UPDATE AppUser
            SET (First_Name, Last_Name, Roll_Number, Branch, Degree, Batch, Email, Hash_of_Password, Residence, Birthday, Profile_Picture, Private, AutoAdd_to_Groups) =(
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) where User_ID = $14`,
            [first, last, rolln, branch, degree, batch, email, pswd, residence, bday, dp, private, autoadd, user_id],
			(err, result) => {
				if (err) {
					res.status(200).json({"status" : "failure", "message" : "Edit Profile - Insert SQL query failed"});
					return console.error('Error executing query', err.stack);
				}
				else{
                    res.status(200).json({"status" : "success", "message" : "Profile edited successfully"});
				}
			}
        );
    }
    catch (err) {
		return err.stack;
    }
}

const get_profile_info = async (req, res) => {
    // incomplete
    try {
        let user_id = req.cookies.user_id
        let first = req.body.first;
        first = first == undefined ? null : first 
        let last = req.body.last;
        last = last == undefined ? null : last
        let rolln =  req.body.rolln;
        rolln =  rolln == undefined? null : rolln;
        let branch =req.body.branch;
        branch = branch == undefined? null : branch;
        let degree =req.body.degree
        degree = degree == undefined? null : degree;
        let batch = req.body.batch
        batch = batch == undefined? null : batch;
        let email = req.body.email
        email = email == undefined? null : email;
        let pswd = req.body.pswd
        pswd = pswd == undefined? null: email;
        let residence = req.body.residenc
        residence = residence == undefined? null : residence;
        let bday = req.body.bday
        bday = bday == undefined? null :bday
        let dp = req.body.dp
        dp = dp == undefined? null : dp
        let private = req.body.hidden
        private = private == undefined? null : private
        let autoadd = req.body.autoadd
        autoadd = autoadd == undefined ? null : autoadd

        pool.query(
            `UPDATE AppUser
            SET (First_Name, Last_Name, Roll_Number, Branch, Degree, Batch, Email, Hash_of_Password, Residence, Birthday, Profile_Picture, Private, AutoAdd_to_Groups) =(
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) where User_ID = $14`,
            [first, last, rolln, branch, degree, batch, email, pswd, residence, bday, dp, private, autoadd, user_id],
			(err, result) => {
				if (err) {
					res.status(200).json({"status" : "failure", "message" : "Edit Profile - Insert SQL query failed"});
					return console.error('Error executing query', err.stack);
				}
				else{
                    res.status(200).json({"status" : "success", "message" : "Profile edited successfully"});
				}
			}
        );
    }
    catch (err) {
		return err.stack;
    }
}


			
module.exports = {
   edit_profile,
   get_profile_info,
}
