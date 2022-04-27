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
        var result;
        let user_id = req.body.user_id;
        let start = req.body.start;
        let end = req.body.end;
        let materialised_view_start = start > 51 ? 51 : start;
        let materialised_view_end = end < 50 ? end : 50;
        
        let materialised_view_ans = pool.query(
            `select Post_id, Page_ID, User_ID, Content_Type, Content, Time, Post_Rank
            from Timeline
            where Post_Rank between $2 and $3 and User_ID = $1`,
            [user_id, materialised_view_start, materialised_view_end]
        );
        if(start > 50){        
        let ans = pool.query(
            `select * 
            from 
            (select Post.Post_id, Post.Page_ID, Post.User_ID, Post.Content_Type, Post.Content, Post.Time, rank() over (Partition By Post.User_ID order by Post.Time desc) as Post_Rank
                from Post where Post.User_ID = $1
            ) as intermediate
            where Post_Rank between $2 and $3`,
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
    get_timeline,
}
