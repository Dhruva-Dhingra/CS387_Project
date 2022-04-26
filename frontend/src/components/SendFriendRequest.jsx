import React, { useState, useContext } from 'react';
import TimelineFinder from '../apis/TimelineFinder';
import { Context } from '../context/Context';

const SendFriendRequest = () => {
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

    const {sendFriendRequest} = useContext(Context)
    const [friendRequest, setFriendRequest] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await TimelineFinder.post("/:id", {
              text_message: text_message,
          })
          sendFriendRequest(response.data.data.venue);
          console.log(response);
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Send your Friend Request! </h1>
    <form action="">
        <div className="form-row">
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Send Friend Request</button></center>          
        </div>
    </form>
</div>;
}

export default SendFriendRequest;