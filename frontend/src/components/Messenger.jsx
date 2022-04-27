import React, { useState, useContext } from 'react';
import MessageFinder from '../apis/MessageFinder';
import { Context } from '../context/Context';

const Messenger = (props) => {
    const {friends, setFriends} = useContext(Context);
    let history = useNavigate();
    useEffect( ()=> {
        const fetchData = async () => {
            try {
                const response = await  MessageFinder.get("/messenger"); // TODO : add id as request parameter
                // console.log(response.data);
                setFriends(response.data.data.friends);
            } catch (err) {}
        }

        fetchData();
   },[]) 

   const handleMsgSelect = (id) => {
    history.push(`/homepage/${id}`);
  };

  return <div className='list-group'>
  <table className="table table-hover table-dark table-striped table-bordered">
      <thead>
        <tr className='bg-primary'>
            <th scope = "col">Friend's User ID</th>
        </tr>
      </thead>
      <tbody>
          {friends && friends.map(friend => {
              return (
                <tr onClick={() => handlePostSelect(friend.user_id)} 
                key={friend.friend_id}>
                  <td>{friend.friend_id}</td>
              </tr>
              )
          })}
      </tbody>
  </table>
</div>;
};

export default Messenger;