import React, { useState, useContext, useEffect } from 'react';
// import TimelineFinder
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
import TimelineFinder from '../apis/TimelineFinder';


const DisplayPostTimleine = () => {
    const {poststm, setPoststm} = useContext(Context);
    // const {offset, setOffset} = useContext(Context);
    const [itemOffsettm, setItemOffsettm] = useState(0);
    const [pageCounttm, setPageCounttm] = useState(0);
    const [postscounttm, spostscounttm] = useState(0);
    const [isNextDisabledtm, setisNextDisabledtm] = useState(false);

    const [isDisabledtm, setisDisabledtm] = useState(true);
    let history = useNavigate();
    useEffect( (id)=> {
         const fetchData = async () => {
             try {
              if(pageCounttm === 0){
                setisDisabledtm(true);
            } else {
                setisDisabledtm(false);
            }
          
    
                 const response = await  TimelineFinder.post(`/:${id}/`);
                 console.log(response.data);
                 const endOffsettm = itemOffsettm + 20;
                 spostscounttm(response.data.data.postscount);
                 setPoststm(response.data.data.postList.slice(itemOffsettm, endOffsettm));
                //  setPosts(response.data.data.postList);
                 setPageCounttm(pageCounttm+1);
                 console.log(poststm)
                 // TODO: check this once
                 if(pageCounttm*20 > postscounttm){
                  setisNextDisabledtm(true);
              } else {
                  setisNextDisabledtm(false);
              }
      
             } catch (err) {}
         }
 
         fetchData();
    },[itemOffsettm, 20]) 
    
    // const handlePostSelect = (id) => {
    //     history.push(`/homepage/${id}`);
    //   };

      const handleNextPosts = () => {
        var newOffsettm = (pageCounttm * 20);
        if (newOffsettm>= postscounttm)
        {
          newOffsettm = newOffsettm -20;
        }
        setItemOffsettm(newOffsettm);
        history(`/timeline`);
      };


      // 1 : newoffset 0 2: newoffset 0
      const handlePrevPosts = () => {
       
        var newOffsettm;

        if ((pageCounttm -2) < 0)
        {
          newOffsettm = 0;
          setPageCounttm(0);
          setItemOffsettm(newOffsettm);
          history(`/timeline`);
        }
        else
        {
         newOffsettm = ((pageCounttm-2) * 20);
         setPageCounttm(pageCounttm-2);
         setItemOffsettm(newOffsettm);
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
            {poststm && poststm.map(post => {
                return (
                  <tr 
                  key={post.post_id}>
                    {/* <td>{posts.post_id}</td> */}
                    <td>{post.post_id}</td>
                </tr>
                )
            })}
        </tbody>
    </table>
   
    <left><button   disabled={isDisabledtm} className="btn btn-warning btn-lg" onClick={() => handlePrevPosts()}>Prev</button></left> 
    <right><button disabled={isNextDisabledtm}  className="btn btn-warning btn-lg" onClick={() => handleNextPosts()}>Next</button></right>
</div>;

};

export default DisplayPostTimleine;
