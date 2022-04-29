import React, { Component } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';


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
				fetch('http://localhost:8080/logout', reqOpt)
						.then(resp => resp.json());
		}

		const goBack = () => {
				history('/homepage');
		}
		return (
				<center><Button onClick={handleClick} variant='warning'>Logout</Button>{' '}<Button vavriant='primary' onClick={goBack}>Go back</Button></center>	
				
		);
}


export default LogOut;
