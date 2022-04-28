import React, { useState, useContext } from 'react';
import LikeFinder from '../apis/LikeFinder';
import { Context } from '../context/Context';

const Like = (post_id) => {
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
        e.preventDefault()
        try {
          const response = await LikeFinder.post("/", {
              'post_id' : post_id,
              'reaction' : 0,
          }).then(response => {
            let data = response.json(); 
            if(data.state == "success"){
              alert("Post " + toString(post_id) + " Liked!");
            } else {
              alert("Post " + toString(post_id) + " coult not be Liked");
            }
          });
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Like Button </h1>
    <form action="">
        <div className="form-row">
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Like</button></center>          
        </div>
    </form>
</div>;
}

export default Like;