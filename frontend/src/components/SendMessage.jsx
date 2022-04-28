import React, { useState, useContext } from 'react';
import MessageFinder from '../apis/MessageFinder';
import { Context } from '../context/Context';
import { useLocation } from 'react-router-dom';

const SendMessage = () => {
    const head = {
        color: '#7c795d', 'fontFamily': 'Trocchi', 
        'fontSize': '60px', 'fontWeight': 'normal', 'lineHeight': '48px', 
        'textAlign': 'center'
      }
      const head2 = {
        color: '#7c795d', 'fontFamily': 'Trocchi', 
        'fontSize': '40px', 'fontWeight': 'normal', 'lineHeight': '48px', 
        'textAlign': 'center'
      }

    const {sendMessage} = useContext(Context)
    const [text_message, setTextMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
			var rightNow = new Date();
			var dateTime = rightNow.toISOString().slice(0,19).replace("T"," ");
		  console.log("Sending Post to backend");
          const response = await MessageFinder.post("/:id2", {
              content : text_message,
			  time : dateTime
          })
          sendMessage(response.data.data.venue);
          console.log(response);
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Send your message! </h1>
    <form action="">
        <div className="form-row">
          <div className="col">
              <input value = {text_message} onChange={(e) => setTextMessage(e.target.value)} type="text" className='form-control' placeholder='Text'/>
          </div>
          <br></br>
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Send</button></center>          
        </div>
    </form>
</div>;
}

export default SendMessage;