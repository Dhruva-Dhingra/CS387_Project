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


const create_post = async (req, res) => {
    try {
        // Post_ID bigint PRIMARY KEY ,
        // Page_ID bigint,
        // User_ID bigint,
        // Content_Type int NOT NULL,
        // Content  bytea NOT NULL,
        // Time  timestamp NOT NULL,
        // Validity  int NOT NULL,
        // FOREIGN KEY (User_ID) REFERENCES AppUser (User_ID),
        // FOREIGN KEY (Page_ID) REFERENCES Page (Page_ID)
        var result;
        let page_id = parseInt(req.body.page_id);
        let user_id = parseInt(req.body.user_id);
        let content_type = parseInt(req.body.content_type);
        let content = req.body.content;
        let time = Date.parse(req.body.time);
        let validity = 1;

        let insert_result = pool.query(
            `insert into Post(Page_ID, User_ID, Content_Type, Content, Time)
            values
            ($1, $2, $3, $4, $5, $6)`,
            [page_id, user_id, content_type, content, time, validity]
        );
    }
    catch (err) {
		return err.stack;
    }
}


			
module.exports = {
   create_post,
}
