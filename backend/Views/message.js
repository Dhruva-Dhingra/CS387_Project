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
	send_message,
}
