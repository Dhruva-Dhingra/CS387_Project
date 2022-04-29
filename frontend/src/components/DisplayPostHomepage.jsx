import React, { useState, useContext, useEffect } from 'react';
import HomepageFinder from '../apis/HomepageFinder';
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
import Like from "../components/Like";
import Unlike from "../components/Unlike";



const DisplayPostHomepage = () => {
    const {posts, setPosts} = useContext(Context);
    // const {offset, setOffset} = useContext(Context);
    const [itemOffset, setItemOffset] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [postscount, spostscount] = useState(0);
    const [isNextDisabled, setisNextDisabled] = useState(false);

    const [isDisabled, setisDisabled] = useState(true);
    let history = useNavigate();
    useEffect( ()=> {
         const fetchData = async () => {
             try {
              if(pageCount === 0){
                setisDisabled(true);
            } else {
                setisDisabled(false);
            }
            var end = itemOffset+19;
       
                 const response = await  HomepageFinder.post("/", {
                  start: `${itemOffset}`,
              end : `${end}`
          });
                 console.log(response.data);
                 spostscount(response.data.data.postscount);
                 setPosts(response.data.data.postList);
                 setPageCount(pageCount+1);
   
                 console.log(posts)
                 setTimeout(() => {fetchData()}, 5000);
      
             } catch (err) {}
         }
 
         fetchData();
    },[itemOffset, 20]) 
    
    const handlePostSelect = (id) => {
        history.push(`/homepage/${id}`);
      };

      const handleNextPosts = () => {
        console.log("clicked on next");
        var newOffset = itemOffset;
        newOffset = newOffset + 20;
        setItemOffset(newOffset);
        history(`/homepage`);
      };


      // 1 : newoffset 0 2: newoffset 0
      const handlePrevPosts = () => {
       
        var newOffset;

        if ((pageCount -2) < 0)
        {
          newOffset = 0;
          setPageCount(0);
          setItemOffset(newOffset);
          history(`/homepage`);
        }
        else
        {
         newOffset = ((pageCount-2) * 20);
         setPageCount(pageCount-2);
         setItemOffset(newOffset);
        history(`/homepage`);
        }
        
        
        
      };

    return <div className='list-group'>
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              {/* <th scope = "col">Post ID</th> */}
              <th scope = "col">Content</th>
              <th scope = "col">Posted By </th>
              <th scope = "col">Total Likes</th>
              <th scope = "col">Like!</th>
              <th scope = "col">Unlike</th>
          </tr>
        </thead>
        <tbody>
            {posts && posts.map(post => {
                return (
                  <tr 
                  key={post.post_id}>
                    {/* <td>{posts.post_id}</td> */}
                    <td>{post.content}</td>
                    <td>{post.first_name} {post.last_name}</td>
                    <td>{post.reaction_count}</td>
                    <td><Like post_id = {post.post_id}/></td>
                    <td><Unlike post_id = {post.post_id}/></td>
                </tr>
                )
            })}
        </tbody>
    </table>
   
    <button    className="btn btn-warning btn-lg" onClick={() => handlePrevPosts()}>Prev</button>
    <button className="btn btn-warning btn-lg" onClick={() => handleNextPosts()}>Next</button>
</div>;

};

export default DisplayPostHomepage;
