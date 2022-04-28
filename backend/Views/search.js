const neo4j = require('neo4j-driver');
const nconf = require('nconf');
const Pool = require('pg').Pool;
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
    port: port
});

const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));
console.log('Connected to neo4j');
const session = driver.session();

const get_search_results = async (req, res) => {
    console.log('Getting Search Results')
    try {
        
        let user_id = req.cookies.user_id;
        let inp = req.body.input;
        var strings_list = input.split(/(\s+)/);
        let len = strings_list.length;
        // TODO : empty input
        if (len == 0)
            strings_list.push("");
        // get friends , match first and last name
        var q_string = '(first_name like %' + strings_list[0] +'%s or last_name like %'  + strings_list[0] +'%s )';
        for (var idx = 1; idx < len; idx ++){
            var str = 'or (first_name like %' + strings_list[idx] +'%s or last_name like %'  + strings_list[idx] +'%s )';
            q_string = q_string + str;
        }
        let ans = await pool.query(
                         ` with T as select sender User_ID from Friend where Acceptor = $1 and not null(sender) and status = true, 
                         R as select Acceptor User_ID from Friend where sender = $1 and not null(Acceptor) and status = true,
                         S as ((select * from R) union (select * from T)),
                         U as (select * from S natural join (select User_ID, first_name, last_name from AppUser) where $2)
                         `
                         , [user_id, q_string]);
        return ans.rows;
    }
    catch (err) {
    return err.stack;
    }
  }
module.exports = {
get_search_results,
}
