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
        let sender = req.body.sender;
        let receiver = req.body.receiver;
        let time = new Date(); 
        let view_once = 0;  // TODO  -- currently default is set to false
        let deleted = 0;
        let group_id =  req.body.group_id 
        
		
        let ans = await pool.query(
                         `BEGIN;
                         INSERT into message (content, time, view_once, deleted) VALUES ($1, $2, $3, $4);
                         INSERT into private_chat (sender_id, receiver_id) VALUES ($5,$6);
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

const display_chat = async (req,res) =>{
  console.log('Display chat messages');
  try{
  // user1 and user2
  let user1 = req.cookies.user_id;
  let user2 = req.body.id;
  let ans = await pool.query(` 
  with T1  as 
  (SELECT message_id, 1 as rec from private_chat
   where sender_id = $1 and receiver_id = $2),  
  T2 as (
    SELECT message_id,0 as rec from private_chat 
    where sender_id = $2 and receiver_id = $1),
  R1 as (select T1.message_id, content, time, rec from T1, message where message.message_id = T1.message_id),
  R2 as (select T2.message_id, content, time, rec from T2, message where message.message_id = T2.message_id),
  R3 as ((select * from R1) union (select * from R2))
  select * from R3 order by time asc;
       `, [user1, user2]);
    
  return  {
      message : 'Successful',
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
      let ans = await pool.query(
                       `
                       with message_list as 
                       (
                         select message_id, sender_id as sender, receiver_id as receiver 
                         from private_chat where
                         sender_id = $1 or receiver_id = $1
                       )
                       select message.message_id, message.content, message.time, message.view_once, message.deleted, message.invitation, message.group_id, message_list.sender, message_list.receiver
                       from message_list, message
                       where
                       message_list.message_id = message.message_id;
                       `
                       , [user_id]);
      return ans.rows;
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
