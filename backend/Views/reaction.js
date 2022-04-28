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
const remove_post_reaction = async (req,res) => {
    try {
        
        var post_id = req.body.post_id;
		let user_id = req.cookies.user_id;
        const q1 = pool.query(`DELETE FROM reaction where post_id =  $1 and user_id = $2 `, [post_id, user_id]);
        res.status(200).json({
            data: {
                status:  (await q1),
            }
        });
    }
    catch (err){
        console.log(err);
    }


}
const react_to_post = async (req, res) => {
    try {
        var reaction = req.body.reaction;
        var post_id = req.body.post_id;
		let user_id = req.cookies.user_id;
        let time_stamp = new Date();
        const q1 = pool.query(`
        insert into reaction values  ($1,$2,$3,$4)`, [user_id, post_id,reaction, time_stamp]);
        res.status(200).json({
            data: {
                status:  (await q1),
            }
        });
    }
    catch (err){
        console.log(err);
    }
}


const get_reaction_count = async (req, res ) =>{
    try {
        var post_id = req.body.post_id;
        const q1 = pool.query(`
       select  reaction, coalesce(count(distinct User_id),0) from reaction where Post_id = $1 group by Reaction `, [post_id]);
        res.status(200).json({
            data: {
                status:  (await q1),
            }
        });
    }
    catch (err){
        console.log(err);
    }

}
module.exports = {
   react_to_post,
   get_reaction_count,
   remove_post_reaction ,
}
