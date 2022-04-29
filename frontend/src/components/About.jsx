import React, { useState, useContext, useEffect } from 'react';
// import TimelineFinder
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
import AboutFinder from '../apis/AboutFinder';
import { useParams } from 'react-router-dom';

const DisplayAbout = () => {
    const {id} = useParams();
    const {poststm, setPoststm} = useContext(Context);

    let history = useNavigate();
    useEffect( ()=> {
        const fetchData = async () => {
            try {
           const response = await  AboutFinder.get(`/${id}`, {
            start: 1,
            end : 2,
    });
// console.log(response.data.result)
                setPoststm(response.data.result);
                console.log(poststm)
     
            } catch (err) {}
        }
        fetchData();
    },[]);

    return <div className='list-group'>
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              {/* <th scope = "col">Post ID</th> */}
              <th scope = "col">Post Content</th>
          </tr>
        </thead>
        <tbody>
            {poststm && poststm.map(posttm => {
                return (
                  <tr 
                  key={posttm.post_id}>
                    {/* <td>{posts.post_id}</td> */}
                    <td>{posttm.post_id}</td>
                </tr>
                )
            })}
        </tbody>
    </table>
    </div>

}

export default DisplayAbout;