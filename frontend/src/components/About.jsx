import React, { useState, useContext, useEffect } from 'react';
// import TimelineFinder
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
import AboutFinder from '../apis/AboutFinder';
import { useParams } from 'react-router-dom';

const DisplayAbout = () => {
    const {id} = useParams();
    const {poststm, setPoststm} = useContext(Context);
    console.log("HIHIHIHI");
    let history = useNavigate();
    var loaded = false;
    useEffect( ()=> {
        const fetchData = async () => {
            try {
           const response = await  AboutFinder.get(`/${id}`, {
            start: 1,
            end : 2,
    });
    console.log("HIHIHIHI");
// console.log(response.data.result)
                setPoststm(response.data.result);
                console.log(poststm);
                console.log("HI");
                loaded = true;
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
            <tr><td>Name</td><td>{poststm[0].first_name} {poststm[0].last_name}</td></tr>
            <tr><td>Email</td><td>{poststm[0].email}</td></tr>
            <tr><td>Roll Number</td><td>{poststm[0].roll_number}</td></tr>
            <tr><td>Branch</td><td>{poststm[0].branch}</td></tr>
            <tr><td>Degree</td><td>{poststm[0].degree}</td></tr>
            <tr><td>Batch</td><td>{poststm[0].batch}</td></tr>
            <tr><td>Residence</td><td>{poststm[0].residence}</td></tr>
            <tr><td>Birthday</td><td>{poststm[0].birthday}</td></tr>
        </tbody>
    </table>
    </div>

}

export default DisplayAbout;