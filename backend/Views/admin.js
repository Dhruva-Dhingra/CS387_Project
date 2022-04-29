const Pool = require('pg').Pool;
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

const plots = async (req, res) => {
    try {
        const q1 = pool.query("WITH res as (SELECT User_ID, count(*) as num_friends FROM Appuser, Friend WHERE ((AppUser.User_ID = Sender OR AppUser.User_ID = Acceptor) AND Status = 'true') GROUP BY User_ID) SELECT num_friends, count(*) as frequency FROM res GROUP BY num_friends ORDER BY num_friends;");
        const q2 = pool.query("WITH res as (SELECT User_ID, count(*) as num_friends FROM AppUser, Friend WHERE ((AppUser.User_ID = Sender OR AppUser.User_ID = Acceptor) AND Status = 'true') GROUP BY User_ID), res2 as (SELECT Post_ID, count(*) as num_likes FROM Reaction WHERE Reaction.Reaction = 0 GROUP BY Post_ID), res3 as (SELECT num_friends, num_likes FROM res, res2, Post WHERE res.User_ID = Post.User_ID AND res2.Post_ID = Post.Post_ID) SELECT num_friends, avg(num_likes) as avg_likes FROM res3 GROUP BY num_friends ORDER BY num_friends;")
        const q3 = pool.query("WITH res as (SELECT EXTRACT(HOUR FROM Time) as hour FROM Post) SELECT hour, count(*) as hourly_frequency FROM res GROUP BY hour ORDER BY hour;")
        const q4 = pool.query("WITH res as (SELECT EXTRACT(DOW FROM Time) as weekday FROM Post) SELECT weekday, count(*) as weekday_frequency FROM res GROUP BY weekday ORDER BY weekday;")
        const q5 = pool.query("WITH res as (SELECT DATE(Time) as day FROM Post) SELECT day, count(*) as day_frequency FROM res GROUP BY day ORDER BY day;")
        res.status(200).json({
            data: {
                r1: (await q1).rows,
                r2: (await q2).rows,
                r3: (await q3).rows,
                r4: (await q4).rows,
                r5: (await q5).rows
            }
        });
    }
    catch (err){
        res.status(200).json({"status" : "failure", "message" : "Message Could not be sent", data : {r1 : [], r2 : [], r3 : [], r4 : [], r5 : []}});
        console.log(err)
    }
}

const plot1 = async (req, res) => {

    pool.query(
    `
    WITH res as (SELECT User_ID, count(*) as num_friends FROM Appuser, Friend WHERE ((AppUser.User_ID = Sender OR AppUser.User_ID = Acceptor) AND Status = 'true') GROUP BY User_ID) SELECT num_friends, count(*) as frequency FROM res GROUP BY num_friends ORDER BY num_friends;
    `, [], 
    (err, result) => {
        if (err) {
            res.status(200).json({"status" : "failure"});
            return console.error('Error executing query', err.stack);
        }
        else{
            // console.log(result);
            res.status(200).json(result.rows);
        }
    }
    );
}

const plot2 = async (req, res) => {

    pool.query(
    `
    WITH res as (SELECT User_ID, count(*) as num_friends FROM AppUser, Friend WHERE ((AppUser.User_ID = Sender OR AppUser.User_ID = Acceptor) AND Status = 'true') GROUP BY User_ID), res2 as (SELECT Post_ID, count(*) as num_likes FROM Reaction WHERE Reaction.Reaction = 0 GROUP BY Post_ID), res3 as (SELECT num_friends, num_likes FROM res, res2, Post WHERE res.User_ID = Post.User_ID AND res2.Post_ID = Post.Post_ID) SELECT num_friends, avg(num_likes) FROM res3 GROUP BY num_friends ORDER BY num_friends;
    `, [], 
    (err, result) => {
        if (err) {
            res.status(200).json({"status" : "failure"});
            return console.error('Error executing query', err.stack);
        }
        else{
            // console.log(result);
            res.status(200).json(result.rows);
        }
    }
    );
}

const plot3 = async (req, res) => {

    pool.query(
    `
    WITH res as (SELECT EXTRACT(HOUR FROM Time) as hour FROM Post) SELECT hour, count(*) as hourly_frequency FROM res GROUP BY hour ORDER BY hour;
    `, [], 
    (err, result) => {
        if (err) {
            res.status(200).json({"status" : "failure"});
            return console.error('Error executing query', err.stack);
        }
        else{
            // console.log(result);
            res.status(200).json(result.rows);
        }
    }
    );
}

const plot4 = async (req, res) => {

    pool.query(
    `
    WITH res as (SELECT EXTRACT(DOW FROM Time) as weekday FROM Post) SELECT weekday, count(*) as weekday_frequency FROM res GROUP BY weekday ORDER BY weekday;
    `, [], 
    (err, result) => {
        if (err) {
            res.status(200).json({"status" : "failure"});
            return console.error('Error executing query', err.stack);
        }
        else{
            // console.log(result);
            res.status(200).json(result.rows);
        }
    }
    );
}

const plot5 = async (req, res) => {

    pool.query(
    `
    WITH res as (SELECT DATE(Time) as day FROM Post) SELECT day, count(*) as day_frequency FROM res GROUP BY day ORDER BY day;
    `, [], 
    (err, result) => {
        if (err) {
            res.status(200).json({"status" : "failure"});
            return console.error('Error executing query', err.stack);
        }
        else{
            // console.log(result);
            res.status(200).json(result.rows);
        }
    }
    );
}

module.exports = {
    plots,
	plot1,
    plot2,
    plot3,
    plot4,
    plot5
}
