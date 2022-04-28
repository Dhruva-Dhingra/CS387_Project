const Pool = require('pg').Pool;
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


const get_timeline = async (req, res) => {
    try {
        let user_id = req.body.user_id;
        let start = req.body.start;
        let end = req.body.end;
        pool.query(
            `select post_info.post_id, post_info.poster_page_id, post_info.poster_user_id, post_info.content_type, post_info.content, post_info.time, coalesce(reaction_count.reaction_count, 0)
            from 
            (select Post.Post_id, Post.Page_ID as poster_page_id, Post.User_ID as poster_user_id, Post.Content_Type, Post.Content, Post.Time, row_number() over (Partition By Post.User_ID order by Post.Time desc) as Post_Rank
                from Post where Post.User_ID = $1
            ) as post_info left outer join reaction_count
            on post_info.post_rank between $2 and $3 and (post_info.post_id = reaction_count.post_id or reaction_count.post_id is null);`,
            [user_id, start, end],
			(err, result) => {
				if (err) {
					res.status(200).json({"status" : "failure", "message" : "SQL query failed"});
					return console.error('Error executing query', err.stack);
				}
				else{
                    res.status(200).json({"status" : "success", "result" : result.rows});
				}
			}
        );
    }
    catch (err) {
		return err.stack;
    }
}


			
module.exports = {
    get_timeline,
}
