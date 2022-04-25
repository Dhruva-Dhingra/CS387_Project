import React from 'react';
import {BrowserRouter as BrowserRouter, Routes, Route} from "react-router-dom";
import { ContextProvider } from './context/Context';
// import Main from './Main';
// import LoginSignup from '.routes/login_signup';
// import Test from '.routes/Test';
import HomePage from './routes/HomePage';
import TimelinePage from './routes/TimelinePage';
import MessagePage from './routes/MessagePage';

const App = () => {
	
		return (
			<ContextProvider>
				<BrowserRouter>
					<Routes>
						<Route path = "/homepage" element = {<HomePage/>}></Route>
						<Route path = "/timeline/:id" element = {<TimelinePage/>}></Route>
						<Route path = "/message/:id" element = {<MessagePage/>}></Route>
						{/* <Route path = '/' element = {< Test />}></Route> */}
						{/* <Route path = '/' element = {< Test />}></Route> 
			<Route path = '/ls' element = {< LoginSignup />}></Route>  */}
					</Routes>
				</BrowserRouter>
			</ContextProvider>
				
		);
}


export default App;
