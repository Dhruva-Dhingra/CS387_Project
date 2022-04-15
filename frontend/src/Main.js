import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginSignup from './login_signup'

const Main = () => {
		return (
				<Routes>
						<Route path = '/ls' element = {< LoginSignup />}></Route>
				</Routes>
		);
}

export default Main;
