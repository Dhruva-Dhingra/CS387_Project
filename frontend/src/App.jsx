import React from 'react';
import {BrowserRouter as BrowserRouter, Routes, Route} from "react-router-dom";
import { ContextProvider } from './context/Context';
// import Main from './Main';
import LoginSignup from './routes/LoginSignup';
// import Test from '.routes/Test';
import HomePage from './routes/HomePage';
import EditProfile from './routes/EditProfile';
import TimelinePage from './routes/TimelinePage';
import MessagePage from './routes/MessagePage';
import WebAdminPage from './routes/WebAdminPage';
import NotifPage from './routes/NotifPage';


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
<a className="nav-link" href="http://localhost:3000/messenger">Messenger</a>
</li>
<li className="nav-item">
<a className="nav-link" href="http://localhost:3000/requests">Friend Requests</a>
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
<Route path = "/homepage" element = {<HomePage/>}></Route>
<Route path = "/editprofile" element = {<EditProfile/>}></Route>
<Route path = "/timeline/:id" element = {<TimelinePage/>}></Route>
<Route path = "/message/:id" element = {<MessagePage/>}></Route>
<Route path = "/admin" element = {<WebAdminPage/>}></Route>
<Route path = "/notif" element = {<NotifPage/>}></Route>
<Route path = '/ls' element = {< LoginSignup />}></Route> 
</Routes>
</BrowserRouter>
</div>
</ContextProvider>
);
}


export default App;
