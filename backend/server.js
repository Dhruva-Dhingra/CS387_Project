// imports
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

// setting up express options
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
		res.header('Content-Type', 'application/json')
		res.header('Access-Control-Allow-Credentials', true)
		res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
		)
		next()
});

// function imports from files
const {
		plots,
		plot1,
		plot2,
		plot3,
		plot4,
		plot5,
} = require('./Views/admin');

const {
	edit_profile
} = require('./Views/editprofile');

const {
		get_invitations,
		sync_graphdb,
		get_recommendations,
		get_friends,
		reset_graph,
		send_request,
		accept_request,
		decline_request,
} = require('./Views/friends');

const {
		get_homepage_posts,
} = require('./Views/homepage');

const {
		checkIfExists,
    signup,
    login,
		logout,
		verifyToken,
} = require('./Views/login_signup');

const {
		send_message,
		display_chat,
		last_message_list,	
} = require('./Views/message');

const {
		create_post
} = require('./Views/post');

const {
		react_to_post,
		remove_reaction_from_post,
   	get_reaction_count,
   	remove_post_reaction,
} = require('./Views/reaction');

const {
		get_search_results,
} = require('./Views/search');

const {
		get_timeline
} = require('./Views/timeline');

// daemon to sync graph DB with relational DB
let seconds = 500 * 1000;
let user_arr = [];
let friend_arr = [];
setTimeout(async () => {
		let ans = await reset_graph();
		console.log('First delete');
		console.log('Calling periodic function');
		uf = await sync_graphdb(user_arr, friend_arr);
		user_arr = uf.user_arr;
		friend_arr = uf.friend_arr;
		console.log('First syncing done');
});
setInterval(async () => {
		console.log('Calling periodic function');
		uf = await sync_graphdb(user_arr, friend_arr);
		user_arr = uf.user_arr;
		friend_arr = uf.friend_arr;
		console.log('friend_arr =', friend_arr);
		console.log('user_arr =', user_arr);
}, seconds);

const run = (req, res, fn) => {
		let ver = verifyToken(req.cookies.accessToken, req.cookies.user_id);
		if (ver) fn(req, res);
		else res.json({'status' : 'failure', 'message' : 'Invalid User', 'verification': 'failed', 'result' : null})
}

const async_run = async (req, res, fn) => {
		let ver = verifyToken(req.cookies.accessToken, req.cookies.user_id);
		if (ver) await fn(req, res);
		else res.json({'status' : 'failure', 'message' : 'Invalid User', 'verification': 'failed', 'result' : null})
}

// setting up node port
const PORT = 8080
app.listen(PORT, async () => {
		console.log(`Server running on port ${PORT}`);
});

// signup endpoint
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

// login endpoint
app.post('/login', async (req, res) => {
		login(req, res);
});

// logout endpoint
app.get('/logout', async (req, res) => {
		run(req, res, logout);
})

// homepage endpoint
app.post('/homepage', async (req, res) => {
		await async_run(req, res, get_homepage_posts);
});

// timeline endpoint
app.post('/timeline/:user', async (req, res) => {
		await async_run(req, res, get_timeline);
});

// app.get('/timeline/:user', async (req, res) => {
// 	console.log("get timeline @backend");
// 	await async_run(req, res, get_timeline);
// 	console.log("got timeline @backend");

// });


// post creation endpoint
app.post('/create_post', async (req, res) => {
		await async_run(req, res, create_post);
});

app.post('/react', async (req, res) => {
		await async_run(req, res, react_to_post);
});

app.post('/unreact', async (req, res) => {
		await async_run(req, res, remove_reaction_from_post);
});

app.get('/messenger', async(req,res)=> {
		await async_run(req, res, last_message_list);
});

app.get('/messenger/:user', async(req,res)=> {
		await async_run(req, res, display_chat);
});

app.post('/messenger/:user', async(req,res)=> {
		run(req, res, send_message);
});

app.get('/friends/recommendations', async(req, res) => {
		console.log('Backend: getting recommendations');
		await async_run(req, res, get_recommendations);
});

app.get('/friends/invitations', async(req, res) => {
		await async_run(req, res, get_invitations);
});

app.post('/friends/accept', async(req, res) => {
		run(req, res, accept_request);
});

app.post('/friends/send', async(req, res) => {
		run(req, res, send_request);
});

app.post('/friends/decline', async(req, res) => {
		run(req, res, decline_request);
});

// TODO: merge this with homepage
app.post('/search',async(req, res) => {
		await async_run(req, res, get_search_results);
});

app.get('/admin', async(req, res) => {
		await async_run(req, res, plots);
});

app.post('/post', async(req, res) => {
		await async_run(req, res, create_post);
})

app.post('/editprofile', async(req, res) => {

	await async_run(req, res, edit_profile);
})