import React from 'react';
import {BrowserRouter as BrowserRouter, Routes, Route} from "react-router-dom";
import { Navigate } from 'react-router';
import { ContextProvider } from './context/Context';
// import Main from './Main';
import LoginSignup from './routes/LoginSignup';
// import Test from '.routes/Test';
import HomePage from './routes/HomePage';
import EditProfile from './routes/EditProfile';
import TimelinePage from './routes/TimelinePage';
// import Messenger from './components/Messenger';
import MessageBasePage from './routes/MessageBasePage';
import MessagePage from './routes/MessagePage';
import WebAdminPage from './routes/WebAdminPage';
import NotifPage from './routes/NotifPage';
import RecomInvit from './routes/FriendsPage';
import LogOut from './routes/Logout';
import SearchPage from './routes/SearchPage';
import CreatePostPage from './routes/CreatePostPage';
import AboutPage from './routes/AboutPage';
import SearchBoxFinder from './apis/SearchBoxFinder';


const PrivateRoute = ({children}) => {
		let cookie_ls = document.cookie.split(';');
		cookie_ls.map((el) => el.split('=')[0]);
		let b1 = cookie_ls.some((el) => el.includes('user_id'));
		let b2 = cookie_ls.some((el) => el.includes('accessToken'));
		return (b1 && b2)? children: <Navigate to='/' />;
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
<a className="nav-link" href="http://localhost:3000/homepage">Homepage</a>
</li>
<li className="nav-item active">
<a className="nav-link" href="http://localhost:3000/search">Search</a>
</li>
<li className="nav-item active">
<a className="nav-link" href="http://localhost:3000/post">Create Post</a>
</li>
<li className="nav-item active">
<a className="nav-link" href="http://localhost:3000/messenger">Messenger</a>
</li>
<li className="nav-item">
<a className="nav-link" href="http://localhost:3000/friends">Friend Requests</a>
</li>
<li className="nav-item">
<a className="nav-link" href="http://localhost:3000/admin">Analytics</a>
</li>
<li className="nav-item">
<a className="nav-link" href="http://localhost:3000/editprofile">Edit Profile</a>
</li>
<li className="nav-item">
<a className="nav-link" href = "http://localhost:3000/about">About</a>
</li>
<li className="nav-item">
<a className="nav-link" href = "http://localhost:3000/logout">Logout</a>
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
<Route path = '/' element = {< LoginSignup />} /> 
<Route path = '/logout' element = {< LogOut />} />
<Route path = "/homepage" element = {<PrivateRoute><HomePage/></PrivateRoute>} />
<Route path = "/editprofile" element = {<PrivateRoute><EditProfile/></PrivateRoute>} />
<Route path = "/timeline/:id" element = {<PrivateRoute><TimelinePage/></PrivateRoute>} />
<Route path = "/messenger/" element = {<PrivateRoute><MessageBasePage/></PrivateRoute>} />
<Route path = "/messenger/:id" element = {<PrivateRoute><MessagePage/></PrivateRoute>} />
<Route path = "/admin" element = {<PrivateRoute><WebAdminPage/></PrivateRoute>} />
<Route path = "/notif" element = {<PrivateRoute><NotifPage /></PrivateRoute>} />
<Route path = "/friends" element = {<PrivateRoute><RecomInvit /></PrivateRoute>} />
<Route path = "/search" element = {<PrivateRoute><SearchPage /></PrivateRoute>} />
<Route path = "/about" element = {<PrivateRoute><AboutPage /></PrivateRoute>} />
<Route path = "/post" element = {<PrivateRoute><CreatePostPage /></PrivateRoute>} />
<Route path = "*" element = {<Navigate to='/homepage' replace />} />
</Routes>
</BrowserRouter>
</div>
</ContextProvider>
);
}


export default App;


