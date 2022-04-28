const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cookieParser());
var corsOptions = {
    origin: 'http://localhost:3000',
		credentials: true
};

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const {
		checkIfExists,
    signup,
    login,
		verifyToken,
		verifyTokenWithUserID,
} = require('./Views/login_signup');

const {
		get_invitations,
		sync_graphdb,
		get_recommendations,
		get_friends,
		reset_graph,
} = require('./Views/friends');

const {
		plot1,
		plot2,
		plot3,
		plot4,
		plot5

} = require('./Views/admin');


const {
		get_homepage_posts
} = require('./Views/homepage');

const {
		get_timeline
} = require('./Views/timeline');

const {
		create_post
} = require('./Views/post');

const {
		send_message,
		display_chat,
		last_message_list,
		
} = require('./Views/message');

app.use(function(req, res, next) {
		res.header('Content-Type', 'application/json')
		res.header('Access-Control-Allow-Credentials', true)
		res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
		)
		next()
})

// let seconds = 500 * 1000;
// let user_arr = [];
// let friend_arr = [];
// setTimeout(async () => {
// 		let ans = await reset_graph();
// 		console.log('First delete');
// 		console.log('Calling periodic function');
// 		uf = await sync_graphdb(user_arr, friend_arr);
// 		user_arr = uf.user_arr;
// 		friend_arr = uf.friend_arr;
// 		console.log('friend_arr =', friend_arr);
// 		console.log('user_arr =', user_arr);
// });
// setInterval(async () => {
// 		console.log('Calling periodic function');
// 		uf = await sync_graphdb(user_arr, friend_arr);
// 		user_arr = uf.user_arr;
// 		friend_arr = uf.friend_arr;
// 		console.log('friend_arr =', friend_arr);
// 		console.log('user_arr =', user_arr);
// }, seconds);

app.post('/test', async (req, res) => {
		if (verifyToken(req.cookies.accessToken)) res.json({'result': 'success'});
		else res.json({'result': 'failed'})
		console.log(req.body);
		console.log(req.cookies);
});

const PORT = 8080
app.listen(PORT, async () => {
		console.log(`Server running on port ${PORT}`);
});

app.post('/signup', async(req, res) => {
		let ex = await checkIfExists(req.body.email);
		if (!ex){
				signup(req, res);
		}
		else{
				console.log('Could not sign up!');
				res.status(400).json({"status" : "failure"});
		}
});

app.get('/checklogin', async (req, res) => {
		console.log('Checking for login');
		if (req.cookies.accessToken) {
				if (verifyToken(req.cookies.accesssToken)) {
						res.json({'logged_in': true});
				}
				else {
						res.json({'logged_in': false});
				}
		}
		else {
				res.json({'logged_in': false});
		}
})

app.post('/login', async (req, res) => {
		login(req, res);
});

app.get('/logout', async (req, res) => {
		res.clearCookie('accessToken');
		res.clearCookie('user_id');
})

app.post('/homepage', async (req, res) => {
		console.log("Get Homepage");
		let verification = false;
		if (verifyToken(req.cookies.accessToken) && req.cookies.user_id){
				verification = true;
				console.log('Verified user', req.cookies.user_id);
		}
		else{
				verification = false;
				res.json({'verification': 'failed', 'result' : null})
		}
		if(verification){
				get_homepage_posts(req, res);
		}
});

app.post('/timeline/:user', async (req, res) => {
		console.log('Getting Timeline Posts');
		let verification = false;
		if (verifyToken(req.cookies.accessToken)){
				verification = true;
		}
		else{
				verification = false;
				res.json({'verification': 'failed', 'result' : null})
		}
		console.log(req.body);
		console.log(req.cookies);
		console.log("Called Post Timeline");
		if(verification){
				get_timeline(req, res);
		}
});

app.post('/create_post', async (req, res) => {
		let verification = false;
		let user_id = req.body.user_id;
		if (verifyTokenWithUserID(req.cookies.accessToken, user_id)){
				verification = true;
		}
		else{
				verification = false;
				res.json({'verification': 'failed', 'result' : null})
		}
		if(verification){
				create_post(req, res);
		}
});

app.get('/messenger', async(req,res)=> {

		console.log('Received request');
		// console.log(req.params.id);
		let id1  = req.cookies.user_id;
		console.log(id1);
		let ans = await last_message_list (req,res);
		console.log('Received response', ans);
		res.status(200).json({'result' : ans.rows});
});

app.get('/messenger/:user', async(req,res)=> {

	console.log('Received request');
	// console.log(req.params.id);
	let id1  = req.cookies.user_id;
	console.log(id1);
	let ans = await display_chat (req,res);
	console.log('Received response', ans);
});

app.post('/messenger/:user', async(req,res)=> {

	console.log('Received request');
	// console.log(req.params.id);
	let id1  = req.cookies.user_id;
	console.log(id1);
	let ans = await send_message (req,res);
	console.log('Received response', ans);
});

app.get('/friends/recommendations', async(req, res) => {
		console.log('In recommendations endpoint');
		let verification = false;
		if (verifyToken(req.cookies.accessToken)){
				verification = true;
		}
		else{
				verification = false;
				res.json({'verification': 'failed', 'result' : null})
		}
		console.log(req.body);
		if (verification) {
				let user_id = req.cookies.user_id;
				console.log('Recommendations: verified, user_id -', user_id);
				let ans = await get_recommendations(user_id);
				res.json(ans);
		}
});

app.get('/friends/invitations', async(req, res) => {
		console.log('In invitations endpoint');
		let verification = false;
		if (verifyToken(req.cookies.accessToken)){
				verification = true;
		}
		else{
				verification = false;
				res.json({'verification': 'failed', 'result' : null})
		}
		console.log(req.body);
		if (verification) {
				let user_id = req.cookies.user_id;
				console.log('Recommendations: verified, user_id -', user_id);
				let ans = await get_invitations(user_id);
				res.json(ans);
		}
});

app.get('/admin', async(req, res) => {
		console.log("ADMIN ENTERED");
		plot1(req, res);
});

// app.post('/signup', (req, res) => {
// 		console.log('At signup backend!');
// 		console.log(req.body);
// });
// app.post('/login', (req, res) => {
// 		console.log('At login backend!');
// 		console.log(req.body);
// });

