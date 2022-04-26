// // const Pool = require('pg').Pool;
// const Pool = require('pg').Pool;
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const config = require('../config/auth.config')
// require('dotenv').config();

// var user = process.env.USR;
// var host = process.env.HOST;
// var database = process.env.DATABASE;
// var password = process.env.PASSWORD;
// var port = process.env.PORT;


// console.log(user, host, database, password, port);

// const pool = new Pool({
//     user: user,
//     host: host,
//     database: database,
//     password: password,
//     port: port
// });

// console.log('Pool made');


const auto_message_id = async () => {
    try {
				console.log('Creating auto-incrementing sequence for message relation');
				let len = await pool.query(	`select count(*) from message;`);
				len = len.rows[0].count;
				console.log('len is', len);
				let quer =  await pool.query(
                                    `
                                    create sequence if not exists inc
                                    start with ${len + 1}
                                    increment by 1;
                                    alter table message
                                    alter column message_id
                                    set default nextval('inc');
                                    `);
				console.log('Auto-incrementing message ID made');
    } 
    catch (err) {
				return err.stack;
    }
}

const send_message = async (req, res) => {
		console.log('Adding message to backend')
    try {
        
        let content = req.body.conent;
        let sender = req.body.sender;
        let receiver = req.body.receiver;
        let time = new Date(); 
        let view_once = 0;  // TODO  -- currently default is set to false
        let deleted = 0;
        let group_id =  req.body.group_id 
        
		
        let ans = await pool.query(
                         `BEGIN;
                         INSERT into message (content, time, view_once, deleted) VALUES ($1, $2, $3, $4);
                         with T as SELECT count(*) as msg_id from message
                         INSERT into private_chat (msg_id, sender_id, receiver_id) VALUES (msg_id,$5,$6);
                         COMMIT;`,
						[content, time, view_once, deleted, sender,receiver]

				);
        return {
                message: 'Successful'
             };
    }
    catch (err) {
		return err.stack;
    }
}


			
module.exports = {
    auto_message_id,
	send_message,
    
}
