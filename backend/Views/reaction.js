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

const react_to_post = async (req, res) => {
    var reaction = req.body.reaction;
    var post_id = req.body.post_id;
    let user_id = req.cookies.user_id;
    let time_stamp = new Date();
    pool.query(`select * from reaction where user_id = $1 and post_id = $2 and reaction = $3`,
    [user_id, post_id,reaction, time_stamp],
    (err, result) => {
        if (err) {
            res.status(200).json({"status" : "failure", "message" : "Query Failed"});
            return console.error('Query Failed', err.stack);
        }
        else{
            if(result.rows.length != 0){
                res.status(200).json({
                    accessToken: null,
                    message: "Already Liked this Post",
                    status : "failure",
                });
            }
            else{
                pool.query(`
                insert into reaction values  ($1,$2,$3,$4)`, [user_id, post_id,reaction, time_stamp],
                (err, result) => {
                    if(err){
                        res.status(200).json({"status" : "failure", "message" : "Query Failed"});
                        return console.error('Query Failed', err.stack);
                    }
                    else{
                        res.status(200).json({"status" : "success", "message" : "success"});
                    }
                }
                );
            }
        }
    }
    );
}

const remove_reaction_from_post = async (req, res) => {
    var reaction = req.body.reaction;
    var post_id = req.body.post_id;
    let user_id = req.cookies.user_id;
    
    pool.query(`select * from reaction where user_id = $1 and post_id = $2 and reaction = $3`,
    [user_id, post_id,reaction, time_stamp],
    (err, result) => {
        if (err) {
            res.status(200).json({"status" : "failure", "message" : "Query Failed"});
            return console.error('Query Failed', err.stack);
        }
        else{
            if(result.rows.length == 0){
                res.status(200).json({
                    accessToken: null,
                    message: "No reaction on this Post to remove",
                    status : "failure",
                });
            }
            else{
                pool.query(`
                delete from reaction user_id = $1 and post_id = $2 and reaction = $3`, [user_id, post_id, reaction],
                (err, result) => {
                    if(err){
                        res.status(200).json({"status" : "failure", "message" : "Query Failed"});
                        return console.error('Query Failed', err.stack);
                    }
                    else{
                        res.status(200).json({"status" : "success", "message" : "success"});
                    }
                }
                );
            }
        }
    }
    );
}

const get_reaction_count = async (req, res ) =>{
    try {
        var post_id = req.body.post_id;
        const q1 = pool.query(`
        select  reaction, coalesce(count(distinct User_id),0) from reaction where Post_id = $1 group by Reaction `, [post_id]);
        res.status(200).json({
            data: {
                status:  (await q1).rows,
            }
        });
    }
    catch (err){
        console.log(err);
    }

}
module.exports = {
   react_to_post,
   remove_reaction_from_post,
   get_reaction_count,
   remove_post_reaction,
}
