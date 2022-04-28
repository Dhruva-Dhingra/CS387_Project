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
    password: password,
    port: port
});

const driver = neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));
console.log('Connected to neo4j');
const session = driver.session();

const get_search_results = async (req, res) => {
    console.log('Getting Search Results')
    try {
        let user_id = req.cookies.user_id;
        let input = String(req.body.input).trim();
        console.log(input);
        var strings_list = input.split(/(\s+)/);
        let len = strings_list.length;
        for(var idx = len; idx >= 0; idx--){
            strings_list[idx] = String(strings_list[idx]);
            if(strings_list[idx].trim() == ""){
                strings_list[idx] = strings_list[len - 1];
                len--;
            }
        }
        // TODO : empty input
        if (len == 0){
            res.status(200).json({"status" : "failure", "result" : null});
            return;
        }
            
        var query = 'select User_ID, first_name, last_name from AppUser where ';
        var array = [];
        for(var idx = 0; idx < len; idx++){
            var idx_str = (idx + 1).toString();
            console.log(idx_str);
            query = query + "first_name like $" + idx_str + " or last_name like $" + idx_str;
            if(idx != len - 1){
                query = query + " or ";
            } else {
                query = query + ";";
            }
            array.push("%" + strings_list[idx] + "%");
        }
        // console.log(query);
        // console.log(array);
        let ans = await pool.query(query, array);
        // console.log(ans.rows);
        res.status(200).json({"status" : "success", "result" : ans.rows});
        return ans.rows;
    }
    catch (err) {
        console.log(err.stack);
        res.status(200).json({"status" : "failure", "result" : null});
        return err.stack;
    }
  }
module.exports = {
get_search_results,
}
