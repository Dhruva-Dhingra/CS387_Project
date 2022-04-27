import React, { useState, useContext, useEffect } from 'react';
import HomepageFinder from '../apis/HomepageFinder';
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";

const DisplayPost = () => {

    const {posts, setPost} = useContext(Context)
    let history = useNavigate();
    useEffect( ()=> {
         const fetchData = async () => {
             try {
                 const response = await  HomepageFinder.get("/");
                 setPost(response.data.data.result);
             } catch (err) {}
         }
 
         fetchData();
    },[]) 
    
    const handlePostSelect = (id) => {
        history.push(`/homepage/${id}`);
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

export default DisplayPost;
