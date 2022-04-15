import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
// import Main from './Main';
import LoginSignup from './login_signup'
import Test from './Test'

function App() {
		return (
				<BrowserRouter>
						<Routes>
								<Route path = '/' element = {< Test />}></Route>
								<Route path = '/ls' element = {< LoginSignup />}></Route>
						</Routes>
				</BrowserRouter>
		);
}

export default App;
