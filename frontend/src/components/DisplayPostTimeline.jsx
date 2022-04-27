import React, { useState, useContext, useEffect } from 'react';
import TimelineFinder from '../apis/TimelineFinder';
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";

const DisplayPostTimeline = () => {

    const {posts, setPost} = useContext(Context)
    let history = useNavigate();
    useEffect( ()=> {
         const fetchData = async () => {
             try {
                 const response = await  TimelineFinder.get("/");
                 setPost(response.data.data.result);
             } catch (err) {}
         }
 
         fetchData();
    },[]) 
    
    const handlePostSelect = (id) => {
        history.push(`/timeline/${id}`);
      };

    return <div className='list-group'>
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              <th scope = "col">Post ID</th>
              <th scope = "col">Post Content</th>
          </tr>
        </thead>
        <tbody>
            {posts && posts.map(post => {
                return (
                  <tr onClick={() => handlePostSelect(posts.post_id)} 
                  key={posts.post_id}>
                    <td>{posts.post_id}</td>
                    <td>{posts.content}</td>
                </tr>
                )
            })}
        </tbody>
    </table>
</div>;

};

export default DisplayPostTimeline;
