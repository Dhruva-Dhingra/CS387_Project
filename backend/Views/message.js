// const Pool = require('pg').Pool;
const Pool = require('pg').Pool;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config/auth.config')
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

console.log('Pool made');

const send_message = async (req, res) => {
		console.log('Adding message to backend');
    try {
		let content = req.body.content;
		let sender = req.cookies.user_id;
		sender = parseInt(sender);
		// let receiver = req.body.receiver;
		let receiver = 2;
        let time = req.body.time;
        let view_once = false;  // TODO  -- currently default is set to false
        let deleted = false;
		// let group_id =  req.body.group_id;
		
		const pool_1 = new Pool({user: user,
			host: host,
			database: database,
			password: password,
			port: port});
		;(async () => {
		// note: we don't try/catch this because if connecting throws an exception
		// we don't need to dispose of the client (it will be undefined)
		const client = await pool_1.connect()
		try {
			await client.query('BEGIN');
			const queryText = 'INSERT into message (content, time, view_once, deleted) VALUES ($1, $2, $3, $4) returning message_id;';
			const res = await client.query(queryText, [content, time, view_once, deleted]);
			console.log("Insert into message done");
			const insertDM = 'INSERT into private_chat (message_id, sender_id, receiver_id) VALUES ($1, $2, $3);';
			const insertDMValues = [res.rows[0].message_id, sender, receiver];
			await client.query(insertDM, insertDMValues);
			console.log("Insert into private chat done");
			await client.query('COMMIT');
			console.log("Commit done");
		} catch (e) {
			await client.query('ROLLBACK');
			console.log("Rollback");
			throw e
		} finally {
			client.release();
		}
		})().catch(e => console.error(e.stack))
    //     pool.query(
    //         `
	// 		BEGIN;
    //         INSERT into message (content, time, view_once, deleted) VALUES ($1, $2, $3, $4);
	// 		with mid as (select max(message_id), $5, $6 from message where content = $1 and time = $2)
    //         INSERT into private_chat (message_id, sender_id, receiver_id) select * from mid;
    //         COMMIT;
	// 		`,
	// 		[content, time, view_once, deleted, sender,receiver],
    //         (err, result) => {
    //           if(err){
	// 			console.log("Failed to add message");
    //             console.log(err.stack);
    //             res.status(200).json({"status" : "failure", "message" : "Message Coult not be sent"});
    //           } else{
	// 			console.log("Added Message");
	// 			res.status(200).json({"status" : "success", "message" : "Message Sent!"});
    //           }
    //         }
	// 	);
    }
    catch (err) {
		console.log(err.stack);
		return err.stack;
    }
}

const display_chat = async (req,res) =>{
  console.log('Display chat messages');
  try{
  // user1 and user2
  let user1 = req.cookies.user_id;
  let user2 = req.params.user;
  // console.log(req.params);
  // user2 = 2;
  console.log("User1 %s", user1)
  console.log("User2 %s", user2)

  let ans = await pool.query(` 

  with T1  as 
  (SELECT message_id, 1 as rec from private_chat
   where sender_id = $1 and receiver_id = $2),  
  T2 as (
    SELECT message_id,0 as rec from private_chat 
    where sender_id = $2 and receiver_id = $1),
  R1 as (select T1.message_id as message_id, content, time, rec from T1, message where message.message_id = T1.message_id),
  R2 as (select T2.message_id as message_id, content, time, rec from T2, message where message.message_id = T2.message_id),
  R3 as ((select * from R1) union (select * from R2))
  select * from R3 order by time desc;
       `, [user1, user2]);
    
  console.log(ans.rows[0]);
  return  {
      message : 'Successful',
      data : {
        data: ans.rows

      },
  }
}
  catch (err) {
		return err.stack;
    }
}

const last_message_list = async (req, res) => {
  console.log('Getting Message List')
  try {
      
      let user_id = req.cookies.user_id;
      const ans = await pool.query(
                       `
                       with message_list as 
(
  select (case when sender_id = $1 then receiver_id else sender_id end) as user_id, message_id
  from private_chat where
  sender_id = $1 or receiver_id = $1
),
history as (
 select message.message_id, message.content, message.time, message.view_once, message.deleted, message.invitation, message.group_id, message_list.user_id,
 row_number() over (partition by (user_id) order by message.time desc) as message_rank
 from message_list, message
 where
 message_list.message_id = message.message_id
 )
 select message_id, content, time, view_once, deleted, invitation, group_id, history.user_id, first_name, last_name, email
 from history, appuser
 where message_rank <= 1 and appuser.user_id = history.user_id order by time desc;
                       `
                       , [user_id]);
        console.log(ans.rows);
      res.status(200).json(ans.rows);
  }
  catch (err) {
  return err.stack;
  }
}

module.exports = {
	send_message,
  display_chat,
  last_message_list,
}
