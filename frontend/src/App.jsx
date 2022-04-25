import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { ContextProvider } from './context/Context';
// import Main from './Main';
// import LoginSignup from '.routes/login_signup';
// import Test from '.routes/Test';

import Homepage from './routes/Homepage';

const App = () => {
	
		return (
			<ContextProvider>
				<Router>
					<Switch>
						<Router exact path = "/homepage" component = {Homepage}></Router>
					</Switch>
				</Router>
			</ContextProvider>
				
		);
}

// <BrowserRouter>
// 		<Routes>
// 				{/* <Route path = '/' element = {< Test />}></Route> */}
// 				{/* <Route path = '/ls' element = {< LoginSignup />}></Route> */}
// 		</Routes>
// </BrowserRouter>

export default App;
