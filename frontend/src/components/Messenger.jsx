import React, { useState, useContext } from 'react';
import HomepageFinder from '../apis/HomepageFinder';
import { Context } from '../context/Context';

const Messenger = (props) => {
    const {friends, setFriends} = useContext(Context);
    useEffect( ()=> {
        const fetchData = async () => {
            try {
                const response = await  HomepageFinder.get("/messenger"); // TODO : add id as request parameter
                // console.log(response.data);
                setFriends(response.data.data.friends);
            } catch (err) {}
        }

        fetchData();
   },[]) 
    return (
        <div> Messenger</div>)
}

export default Messenger;