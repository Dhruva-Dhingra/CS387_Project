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
				<button onClick={handleClick}>Logout</button>
				
		);
}


export default LogOut;
