import React, { useState, useContext, useEffect } from 'react';
// import TimelineFinder
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
import TimelineFinder from '../apis/TimelineFinder';
import { useParams } from 'react-router-dom';

const DisplayPostTimleine = () => {
  const { id } = useParams()
    const {poststm, setPoststm} = useContext(Context);
    // const {offset, setOffset} = useContext(Context);
    const [itemOffsettm, setItemOffsettm] = useState(1);
    const [pageCounttm, setPageCounttm] = useState(0);
    const [postscounttm, spostscounttm] = useState(0);
    const [isNextDisabledtm, setisNextDisabledtm] = useState(false);
    

    const [isDisabledtm, setisDisabledtm] = useState(true);
    let history = useNavigate();
    useEffect( ()=> {
      const fetchData = async () => {
          try {
           if(pageCounttm === 0){
             setisDisabledtm(true);
         } else {
             setisDisabledtm(false);
         }
         console.log(itemOffsettm)
         var end = itemOffsettm+9;
         const response = await  TimelineFinder.post(`/${id}`, {
          start: `${itemOffsettm}`,
      end : `${end}`,
  });
              console.log(response.data.rowCount);
              // spostscounttm(response.data.data.postscount);
              
            
             
                  if (response.data.rowCount === 0) {
                    alert("You have reached the end of posts")
                    // handlePrevPoststm();
                  }
                   else{
                   setPageCounttm(pageCounttm+1);
                   setPoststm(response.data.result);}

              // setPageCounttm(pageCounttm+1);
              // console.log(response.data);

              console.log(poststm)
   
          } catch (err) {}
      }

      fetchData();
 },[itemOffsettm, 10]) 
    
    // const handlePostSelect = (id) => {
    //     history.push(`/homepage/${id}`);
    //   };

      const handleNextPoststm= () => {
        console.log("clicked on next");
        var newOffset = itemOffsettm;
        newOffset = newOffset + 10;
        setItemOffsettm(newOffset);
        history(`/timeline/${id}`);
      };


      // 1 : newoffset 0 2: newoffset 0
      const handlePrevPoststm = () => {
       
        var newOffsettm;

        if ((pageCounttm -2) < 0)
        {
          newOffsettm = 0;
          setPageCounttm(0);
          setItemOffsettm(newOffsettm);
          history(`/timeline/${id}`);
        }
        else
        {
         newOffsettm = ((pageCounttm-2) * 10);
         setPageCounttm(pageCounttm-2);
         setItemOffsettm(newOffsettm);
        history(`/timeline/${id}`);
        }
        
        
        
      };

    return <div className='list-group'>
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              {/* <th scope = "col">Post ID</th> */}
              <th scope = "col">Content</th>
          </tr>
        </thead>
        <tbody>
            {poststm && poststm.map(posttm => {
                return (
                  <tr 
                  key={posttm.post_id}>
                    {/* <td>{posts.post_id}</td> */}
                    <td>{posttm.content}</td>
                </tr>
                )
            })}
        </tbody>
    </table>
   
    <button   disabled={isDisabledtm} className="btn btn-warning btn-lg" onClick={() => handlePrevPoststm()}>Prev</button>
    <button disabled={isNextDisabledtm}  className="btn btn-warning btn-lg" onClick={() => handleNextPoststm()}>Next</button>
</div>;

};

export default DisplayPostTimleine;
