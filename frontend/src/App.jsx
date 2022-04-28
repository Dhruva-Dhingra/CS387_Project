import React from 'react';
import {BrowserRouter as BrowserRouter, Routes, Route} from "react-router-dom";
import { ContextProvider } from './context/Context';
// import Main from './Main';
import LoginSignup from './routes/LoginSignup';
// import Test from '.routes/Test';
import HomePage from './routes/HomePage';
import EditProfile from './routes/EditProfile';
import TimelinePage from './routes/TimelinePage';
// import Messenger from './components/Messenger';
import MessageBasePage from './routes/MessageBasePage';
import WebAdminPage from './routes/WebAdminPage';
import NotifPage from './routes/NotifPage';
import RecomInvit from './routes/FriendsPage';


const checkLogin = (nextState, replace, next) => {
		console.log('In checkLogin()');
		const requestOptions = {
				method: 'GET',
				mode: 'cors',
				credentials: 'include',
				headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
				},
		};
		const res = fetch('http://localhost:8080/checklogin', requestOptions)
					.then(res => res.json())
					.then(data => {
							if (!data.logged_in) {
									replace({
											pathname: '/',
											state: {nextPathname: nextState.location.pathname}
									});
							}
					});
		next();
}

const App = () => {
	
return (

<ContextProvider>
<nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
<div className="container">
<a className="navbar-brand">Insti Gram </a>
<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
<span className="navbar-toggler-icon"></span>
</button>
<div className="collapse navbar-collapse" id="navbarResponsive">
<ul className="navbar-nav ms-auto">
<li className="nav-item active">
<a className="nav-link" href="http://localhost:3000/messenger">MessageBasePage</a>
</li>
<li className="nav-item">
<a className="nav-link" href="http://localhost:3000/friends">Friend Requests</a>
</li>
<li className="nav-item">
<a className="nav-link" href="http://localhost:3000/notif">Notifications</a>
</li>
<li className="nav-item">
<a className="nav-link" href="http://localhost:3000/logout">Logout</a>
</li>
</ul>
</div>
</div>
</nav>
<br></br>
<br></br>
<br></br>
<div className="container" >
<BrowserRouter>
<Routes>
		<Route path = "/homepage" element = {<HomePage/>} onEnter={checkLogin}></Route>
<Route path = "/editprofile" element = {<EditProfile/>} onEnter={checkLogin}></Route>
<Route path = "/timeline/:id" element = {<TimelinePage/>} onEnter={checkLogin}></Route>
<Route path = "/messenger/:id" element = {<MessageBasePage/>} onEnter={checkLogin}></Route>
<Route path = "/admin" element = {<WebAdminPage/>} onEnter={checkLogin}></Route>
<Route path = "/notif" element = {<NotifPage/>} onEnter={checkLogin}></Route>
<Route path = '/' element = {< LoginSignup />}></Route> 
<Route path = '/friends' element = {<RecomInvit />} onEnter={checkLogin}></Route>
</Routes>
</BrowserRouter>
</div>
</ContextProvider>
);
}


export default App;
