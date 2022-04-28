import React, { useState, useContext, useEffect } from 'react';
import HomepageFinder from '../apis/HomepageFinder';
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";



const DisplayPostHomepage = () => {
    const {posts, setPosts} = useContext(Context);
    // const {offset, setOffset} = useContext(Context);
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [postscount, spostscount] = useState(0);
    const [isNextDisabled, setisNextDisabled] = useState(false);

    const [isDisabled, setisDisabled] = useState(true);
    let history = useNavigate();
    useEffect( ()=> {
         const fetchData = async () => {
             try {
              if(pageCount == 0){
                setisDisabled(true);
            } else {
                setisDisabled(false);
            }
          
    
                 const response = await  HomepageFinder.post("/");
                 console.log(response.data);
                 const endOffset = itemOffset + 20;
                 spostscount(response.data.data.postscount);
                 setPosts(response.data.data.postList.slice(itemOffset, endOffset));
                //  setPosts(response.data.data.postList);
                 setPageCount(pageCount+1);
                 console.log(posts)
                 // TODO: check this once
                 if(pageCount*20 > postscount){
                  setisNextDisabled(true);
              } else {
                  setisNextDisabled(false);
              }
      
             } catch (err) {}
         }
 
         fetchData();
    },[itemOffset, 20]) 
    
    const handlePostSelect = (id) => {
        history.push(`/homepage/${id}`);
      };

      const handleNextPosts = () => {
        var newOffset = (pageCount * 20);
        if (newOffset>= postscount)
        {
          newOffset = newOffset -20;
        }
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
              <th scope = "col">Post Content</th>
          </tr>
        </thead>
        <tbody>
            {posts && posts.map(post => {
                return (
                  <tr onClick={() => handlePostSelect(post.post_id)} 
                  key={post.post_id}>
                    {/* <td>{posts.post_id}</td> */}
                    <td>{post.post_id}</td>
                </tr>
                )
            })}
        </tbody>
    </table>
   
    <left><button   disabled={isDisabled} className="btn btn-warning btn-lg" onClick={() => handlePrevPosts()}>Prev</button></left> 
    <right><button className="btn btn-warning btn-lg" onClick={() => handleNextPosts()}>Next</button></right>
</div>;

};

export default DisplayPostHomepage;
