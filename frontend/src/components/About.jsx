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
                console.log(poststm);
                console.log("HI");
     
            } catch (err) {}
        }
        fetchData();
    },[]);

    return <div className='list-group'>
        <center>About</center>
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              {/* <th scope = "col">Post ID</th> */}
              <th scope = "col">Details</th>
              <th scope = 'col'>Value</th>
          </tr>
        </thead>
        <tbody>
            <tr><td>Name</td><td>HI</td></tr>
            <tr><td>Email</td><td>HI</td></tr>
            <tr><td>Roll Number</td><td>HI</td></tr>
            <tr><td>Branch</td><td>HI</td></tr>
            <tr><td>Degree</td><td>HI</td></tr>
            <tr><td>Batch</td><td>HI</td></tr>
            <tr><td>Residence</td><td>HI</td></tr>
            <tr><td>Birthday</td><td>HI</td></tr>
        </tbody>
    </table>
    </div>

}

export default DisplayAbout;