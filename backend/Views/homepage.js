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


const get_homepage_posts = async (req, res) => {
    try {
        var result;
        let user_id = req.body.user_id;
        let start = req.body.start;
        let end = req.body.end;
        let materialised_view_start = start > 21 ? 21 : start;
        let materialised_view_end = end < 20 ? end : 20;
        
        let materialised_view_ans = pool.query(
            `select homepage_user, post_id, poster_page_id, poster_user_id, content_type, content, time
            from (
                select homepage_user, post_id, poster_page_id, poster_user_id, content_type, content, time, rank() over (order by time asc) as post_rank
                from Homepage
                where homepage_user = $1
            ) as temp
            where post_rank between $2 and $3`,
            [user_id, materialised_view_start, materialised_view_end]
        );
        if(start > 20){        
        let ans = pool.query(
            `with actual_friends as (
                (select Friend.Sender a, Friend.Acceptor b from Friend where Friend.Accept_Time is not null and Friend.Sender = $1)
                union
                (select Friend.Acceptor a, Friend.Sender b from Friend where Friend.Accept_Time is not null and Friend.Acceptor = $1)
            )
            select homepage_user, post_id, poster_page_id, poster_user_id, content_type, content, time
            from (
                select AppUser.User_ID as homepage_user, Post.Post_ID as post_id, Post.Page_ID as poster_page_id, Post.User_ID as poster_user_id , Post.Content_Type as content_type, Post.Content as content, Post.Time as time, rank() over (order by Post.Time asc) as post_rank
                from Post where 
                (
                    Post.User_ID is not null and
                    Post.User_ID in 
                        (select actual_friends.b from actual_friends where actual_friends.a = $1)
                )
                or
                (
                    Post.Post_ID is not null and
                    Post.Post_ID in 
                        (select Follower.Page_ID from Follower where Follower.User_ID = $1)
                )
                order by Post.Time desc limit $3
            ) as temp
            where post_rank between $2 and $3`,
            [user_id, start, end]
        );
        result = ((await materialised_view_ans).rows).concat((await ans).rows);
        }
        else{
            result = (await materialised_view_ans).rows;
        }
        return result
    }
    catch (err) {
		return err.stack;
    }
}


			
module.exports = {
    get_homepage_posts,
}
