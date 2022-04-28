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
                const response = await  MessageFinder.get(`/${id}`); // TODO : add id as request parameter
                console.log("HI %s", response);
                setMsg(response.data.data);
            } catch (err) {}
        }

        fetchData();
   },[msgs, setMsg]) 

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