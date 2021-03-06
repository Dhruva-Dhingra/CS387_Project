import React, { useState, useContext } from 'react';
import UnlikeFinder from '../apis/UnlikeFinder';
import { Context } from '../context/Context';

const Unlike = (inp) => {
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

    const handleSubmit = async (e) => {
      console.log("handle Submit called");
        e.preventDefault()
        try {
          const response = await UnlikeFinder.post("/", {
              'post_id' : inp.post_id,
              'reaction' : 0,
          }).then(response => {
            let data = response.json(); 
            if(data.state === "success"){
              console.log("Post " + toString(inp.post_id) + " Liked!");
            } else {
              console.log("Post " + toString(inp.post_id) + " coult not be Liked");
            }
          });
        } catch (err) {
          console.log(err.stack)
  
        }
    }

    return <div className='mb-4'>

    <form action="">
        <div className="form-row">
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn">Unlike</button></center>          
        </div>
    </form>
</div>;
}

export default Unlike;