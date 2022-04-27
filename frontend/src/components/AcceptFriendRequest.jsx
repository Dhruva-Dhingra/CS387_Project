import React, { useState, useContext } from 'react';
import TimelineFinder from '../apis/TimelineFinder';
import { Context } from '../context/Context';

const AcceptFriendRequest = () => {
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

    const {acceptFriendRequest} = useContext(Context)
    const [acceptRequest, setacceptRequest] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await NotifFinder.post("/", {
              text_message: text_message,
          })
          acceptFriendRequest(response.data.data.venue);
          console.log(response);
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Accept Friend Request </h1>
    <form action="">
        <div className="form-row">
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Accept Friend Request</button></center>          
        </div>
    </form>
</div>;
}

export default AcceptFriendRequest;