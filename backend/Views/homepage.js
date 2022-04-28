const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
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


const get_homepage_posts = async (req, res) => {
    try {
        var result;
        let user_id = req.cookies.user_id;
        let start = req.body.start;
        let end = req.body.end;
        if(start < 0 || end < 0){
            res.status(200).json({"status" : "failure", "message" : "start or end < 0"});
        }  
        
        pool.query(
            `
            with actual_friends as 
            (
                select (case when friend.sender = $1 then friend.acceptor else friend.sender end) as other_friend from friend where
                (friend.sender = $1 or friend.acceptor = $1) and friend.accept_time is not null
            ),
            post_info_2 as (select post_info.post_id as post_id, post_info.poster_page_id as page_id, post_info.poster_user_id as user_id, post_info.content_type as content_type, post_info.content as content, post_info.time as time, coalesce(sum(reaction_count.reaction_count), 0) as reaction_count
            from (
                select post_id, page_id as poster_page_id, user_id as poster_user_id, content_type, content, time, row_number() over (order by time DESC) as post_rank
                from post, actual_friends
                where
                Post.User_ID is not null and Post.User_ID = actual_friends.other_friend
            ) as post_info left outer join reaction_count
            on post_info.post_rank between $2 and $3 and (post_info.post_id = reaction_count.post_id or reaction_count.post_id is null)
            group by (post_info.post_id, post_info.poster_page_id, post_info.poster_user_id, post_info.content_type, post_info.content, post_info.time))
            select post_info_2.post_id as post_id, post_info_2.page_id as page_id, post_info_2.user_id as user_id, first_name, last_name, email, post_info_2.content_type as content_type, post_info_2.content as content, post_info_2.time as time, post_info_2.reaction_count
            from (post_info_2 join appuser
            on post_info_2.user_id = appuser.user_id) order by time DESC
		    ;`,
            [user_id, start, end],
			(err, result) => {
				if (err) {
					res.status(200).json({"status" : "failure", "message" : "SQL query failed"});
					return console.error('Error executing query', err.stack);
				}
				else{
                    console.log(result.rowCount);
                    res.status(200).json({"status" : "success", "result" : result.rows.length, data: {postList : result.rows, postscount : result.rowCount}});
				}
			}
        );
    }
    catch (err) {
		return err.stack;
    }
}

module.exports = {
    get_homepage_posts,
}
