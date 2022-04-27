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
	verifyToken
} = require('./Views/login_signup');

const {
		get_invitations,
		sync_graphdb,
		get_recommendations,
} = require('./Views/friends');

const {
	get_homepage_posts
} = require('./Views/homepage');

const {
	get_timeline
} = require('./Views/timeline');

const {
	create_post
} = require('./Views/post');

app.use(function(req, res, next) {
		res.header('Content-Type', 'application/json')
		res.header('Access-Control-Allow-Credentials', true)
		res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
		)
		next()
})

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
		if (!ex)
				signup(req, res);
		else console.log('Could not sign up!');
});

app.post('/login', async (req, res) => {
		console.log(req.body);
		let ans = await login(req, res);
		console.log('Received response', ans);
		res.cookie('accessToken', ans.accessToken, {
				secure: true,
				httpOnly: true
		});
		res.json(ans);
		// console.log('JSON response sent');
});

app.post('/homepage', async (req, res) => {
	console.log('Getting Homepage Posts');
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
	console.log("Called Post Homepage");
	if(verification){
		let ans = get_homepage_posts(req, res);
		console.log(ans);
		let result = {'verification' : 'success', 'result' : ans};
		res.json(result);
	}
	res.json()
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
		let ans = get_timeline(req, res);
		console.log(ans);
		let result = {'verification' : 'success', 'result' : ans};
		res.json(result);
	}
	res.json()
});

app.post('/create_post', async (req, res) => {
	let verification = false;
	if (verifyToken(req.cookies.accessToken)){
		verification = true;
	}
	else{
		verification = false;
		res.json({'verification': 'failed', 'result' : null})
	}
	if(verification){
		let ans = create_post(req, res);
		let result = {'verification' : 'success', 'result' : ans};
		res.json(result);
	}
	res.json()
});

app.get('/messenger', async(req,res)=> {

	console.log('Received request');
	console.log(req.params.id);
	let ans = await get_friends (req,res);
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
				get_recommendations(user_id);
		}
});

app.post('/friends/invitations', async(req, res) => {
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
				let user_id = req.body.user_id;
				get_invitations(user_id);
		}
});

// app.post('/signup', (req, res) => {
// 		console.log('At signup backend!');
// 		console.log(req.body);
// });
// app.post('/login', (req, res) => {
// 		console.log('At login backend!');
// 		console.log(req.body);
// });
