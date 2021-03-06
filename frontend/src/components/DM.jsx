import React, { useState, useContext, useEffect } from 'react';
import MessageFinder from '../apis/MessageFinder';
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
const DM = (props) => {
    const {msgs, setMsg} = useContext(Context);
    const { id } = useParams()
    let history = useNavigate();
    useEffect( ()=> {
        const fetchData = async () => {
            try {
                console.log("HI");
               await MessageFinder.get(`/${id}`).then(res => {
                    if(res.data.status === "success"){
                        console.log(res);
                        setMsg(res.data.data.data);
                    console.log("Private Chat messages fetched successfully");
                    } else {
                    console.log("Private Chat messages fetch unsuccessful");
                    }
                }); // TODO : add id as request parameter
              
                setTimeout(() => {fetchData()}, 2000);
            } catch (err) { console.log(err.stack);}
        }

        fetchData();
   },[]) 

//    const handleMsgSelect = (id) => {
//     history.push(`/messenger/${id}`);
//   };

  return <div className='list-group'>
  <table className="table table-hover  table-bordered">
      <thead>
        <tr className='bg-success'>
            <th scope = "col">Message</th>
            <th scope = "col">Time</th>
        </tr>
      </thead>
      <tbody>
          {msgs && msgs.map(msg => {
              return (
                  msg.rec?     <tr  bgcolor="#abc"
                  key={msg.message_id}>
                    <td>{msg.content}</td>
                    <td>{msg.time}</td>
                  
    
     
                </tr> : <tr bgcolor="#eee"
                  key={msg.message_id}>
                    <td>{msg.content}</td>
                    <td>{msg.time}</td>
                  
    
     
                </tr> 
             
              )
          })}
      </tbody>
  </table>
</div>;
};

export default DM;
