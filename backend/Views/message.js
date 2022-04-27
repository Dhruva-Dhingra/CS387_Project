const send_message = async (req, res) => {
		console.log('Adding message to backend');
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

const display_chat = async (req,res) =>{
  console.log('Display chat messages');
  try{
  // user1 and user2
  let user1 = req.body.user1;
  let user2 = req.body.user2;
  let ans = await pool.query(` 
  with T1  as 
  (SELECT message_id, 1 as rec from private_chat
   where sender_id = $1 and receiver_id = $2),  
  T2 as (
    SELECT message_id,0 as rec from private_chat 
    where sender_id = $2 and receiver_id = $1),
  R1 as (select message_id, content, timestamp, rec from T1),
  R2 as (select message_id, content, timestamp, rec from T2),
  R3 as ((select * from R1) union (select * from R2))
  select * from R3 order by timestamp asc;
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
      
      let user_id = req.body.user_id;
      let ans = await pool.query(
                       `
                       select message, content, time, user_1, user_2
                       from
                       Last_Time_Conversation_User
                       where 
                       user_1 = $1;
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
