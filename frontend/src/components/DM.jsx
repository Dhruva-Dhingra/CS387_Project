import React, { useState, useContext, useEffect } from 'react';
import MessageFinder from '../apis/MessageFinder';
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
const DM = (props) => {
    const {msgs, setMsg} = useContext(Context);
    let history = useNavigate();
    useEffect( (id)=> {
        const fetchData = async () => {
            try {
                const response = await  MessageFinder.get("/:id"); // TODO : add id as request parameter
                console.log(response.data);
                setMsg(response.data.data.result);
            } catch (err) {}
        }

        fetchData();
   },[]) 

//    const handleMsgSelect = (id) => {
//     history.push(`/messenger/${id}`);
//   };

  return <div className='list-group'>
  <table className="table table-hover table-dark table-striped table-bordered">
      <thead>
        <tr className='bg-primary'>
            <th scope = "col">Message</th>
            <th scope = "col">Time</th>
        </tr>
      </thead>
      <tbody>
          {msgs && msgs.map(msg => {
              return (
                <tr
                key={msg.msg_id}>
                  <td>{msg.msg_content}</td>
                  <td>{msg.time}</td>
              </tr>
              )
          })}
      </tbody>
  </table>
</div>;
};

export default DM;