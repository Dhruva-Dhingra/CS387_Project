import React, { Component } from 'react';
import { useNavigate } from "react-router-dom";

const LogOut = () => {
		let history = useNavigate();
		const reqOpt = {
				method: 'GET',
				mode: 'cors',
				credentials: 'include',
				headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
				},
		};

		const handleClick = () => {
				history('/')
		}
		fetch('http://localhost:8080/logout', reqOpt)
				.then(resp => resp.json());
		return (
			<center><button onClick={handleClick} className="btn btn-warning btn">Logout</button></center>	
				
		);
}


export default LogOut;
