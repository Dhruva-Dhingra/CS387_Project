import React, { useState, useContext } from 'react';
import TimelineFinder from '../apis/TimelineFinder';
import { Context } from '../context/Context';

const Comment = () => {
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

    const {comment} = useContext(Context)
    const [comment_, setcomment] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await TimelineFinder.post("/:id", {
              text_message: text_message,
          })
          comment(response.data.data.venue);
          console.log(response);
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Send your message! </h1>
    <form action="">
        <div className="form-row">
          <div className="col">
              <input value = {comment_} onChange={(e) => setcomment(e.target.value)} type="text" className='form-control' placeholder='Text'/>
          </div>
          <br></br>
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Comment</button></center>          
        </div>
    </form>
</div>;
}

export default Comment;