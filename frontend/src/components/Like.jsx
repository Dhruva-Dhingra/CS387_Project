import React, { useState, useContext } from 'react';
import LikeFinder from '../apis/LikeFinder';
import { Context } from '../context/Context';

const Like = (inp) => {
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
          const response = await LikeFinder.post("/", {
              'post_id' : inp.post_id,
              'reaction' : 0,
          }).then(response => {
            let data = response.json(); 
            if(data.status === "success"){
              console.log("Post " + toString(inp.post_id) + "Liked!");
            } else {
              console.log("Post " + toString(inp.post_id) + "could not be Liked");
            }
          });
        } catch (err) {
  
          console.log(err);
        }
    }

    return <div className='mb-4'>

    <form action="">
        <div className="form-row">
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn">Like</button></center>          
        </div>
    </form>
</div>;
}

export default Like;