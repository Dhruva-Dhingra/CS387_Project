
import React, { useState, useContext, useEffect } from 'react';
// import HomepageFinder from '../apis/HomepageFinder';

import MessageFinder from '../apis/MessageFinder';
import { Context } from '../context/Context';
import { useNavigate } from 'react-router-dom';


const Messenger = (props) => {
    const {friends, setFriends} = useContext(Context);
    let navigate= useNavigate();
    useEffect( ()=> {
        const fetchData = async () => {
            try {
                console.log('Sending to backend!');
				const requestOptions = {
						method: 'get',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: `id=${1}`,
				};
				console.log(requestOptions);
			    const res =  await MessageFinder.fetch(
                    '/',
                    requestOptions); // TODO : add id as request parameter
                // let data = await res.json();
                console.log("received response from backend");
                console.log(res.data);
                setFriends(res.data.data.friends);
            } catch (err) {}
        }

        fetchData();
   },[]) 

   const handleFriendSelect = (id2) => {
    navigate(`messenger/${id2}`); // TODO
  };

    return (
  <div>
      <div>MESSENGER</div>
    <div className='list-group'>
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              <th scope = "col"></th>
              <th scope = "col"></th>

              {/* <th scope = "col">F</th> */}
          </tr>
        </thead>
        <tbody>
            {friends && friends.map(friend=> {
                return (
                  //   @T - Do we need more key attributes?
                  <tr 
                  onClick={() => handleFriendSelect(friend.user_id)} 
                  key={friend.user_id} >
                  <td>{friend.first_name}  </td>
                  <td>{friend.last_name}</td>
                 </tr>
                )
                
            })}
        </tbody>
    </table>

</div></div> );
} 

export default Messenger;