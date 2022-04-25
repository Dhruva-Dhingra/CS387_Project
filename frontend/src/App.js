import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
// import Main from './Main';
import LoginSignup from '.routes/login_signup';
import Test from './Test';

function App() {
	const bg = {
		'background-color': 'rgb(233, 150, 122)'
		 };
		return (
				<BrowserRouter>
						<Routes>
								{/* <Route path = '/' element = {< Test />}></Route> */}
								{/* <Route path = '/ls' element = {< LoginSignup />}></Route> */}
						</Routes>
				</BrowserRouter>
		);
}

export default App;
