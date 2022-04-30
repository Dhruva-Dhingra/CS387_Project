// imports
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
var corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
};

// setting up express options
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
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
	get_invitations,
	get_recommendations,
	get_friends,
	send_request,
	accept_request,
	decline_request,
	check_request,
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
	get_single_reaction_count,
} = require('./Views/reaction');

const {
	get_search_results,
} = require('./Views/search');

const {
	get_timeline,
	get_about,
} = require('./Views/timeline');

const {
	edit_profile,
	get_profile_info,
} = require('./Views/editprofile');

const run = (req, res, fn) => {
	try{
		let ver = verifyToken(req.cookies.accessToken, req.cookies.user_id);
		if (ver) fn(req, res);
		else res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null })
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
}

const async_run = async (req, res, fn) => {
	try {
		let ver = verifyToken(req.cookies.accessToken, req.cookies.user_id);
		if (ver) await fn(req, res);
		else res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null })
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
}

// setting up node port
const PORT = 8080
app.listen(PORT, async () => {
	try{
		console.log(`Server running on port ${PORT}`);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

// signup endpoint
app.post('/signup', async (req, res) => {
	try{
		let ex = await checkIfExists(req.body.email);
		if (!ex) {
			signup(req, res);
		}
		else {
			console.log('Could not sign up!');
			res.status(400).json({ "status": "failure" });
		}
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

// login endpoint
app.post('/login', async (req, res) => {
	try {
		login(req, res);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

// logout endpoint
app.get('/logout', async (req, res) => {
	try {
		async_run(req, res, logout);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		// console.log(err.stack);
	}
})

// homepage endpoint
app.post('/homepage', async (req, res) => {
	try {
		await async_run(req, res, get_homepage_posts);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

// timeline endpoint
app.post('/timeline/:user', async (req, res) => {
	try {
		await async_run(req, res, get_timeline);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

// app.get('/timeline/:user', async (req, res) => {
// 	console.log("get timeline @backend");
// 	await async_run(req, res, get_timeline);
// 	console.log("got timeline @backend");

// });


// post creation endpoint
app.post('/create_post', async (req, res) => {
	try {
		await async_run(req, res, create_post);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/react', async (req, res) => {
	try {
		await async_run(req, res, react_to_post);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/unreact', async (req, res) => {
	try {
		await async_run(req, res, remove_reaction_from_post);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/get_single_reaction_count', async (req, res) => {
	try {
		await async_run(req, res, get_single_reaction_count);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});


app.get('/messenger', async (req, res) => {
	try {
		await async_run(req, res, last_message_list);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.get('/messenger/:user', async (req, res) => {
	try {
		await async_run(req, res, display_chat);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/messenger/:user', async (req, res) => {
	try {
		run(req, res, send_message);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.get('/friends/recommendations', async (req, res) => {
	try {
		console.log('Backend: getting recommendations');
		await async_run(req, res, get_recommendations);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.get('/friends/invitations', async (req, res) => {
	try {
		await async_run(req, res, get_invitations);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/friends/accept', async (req, res) => {
	try {
		run(req, res, accept_request);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/friends/send', async (req, res) => {
	try {
		run(req, res, send_request);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/friends/decline', async (req, res) => {
	try {
		run(req, res, decline_request);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

// TODO: merge this with homepage
app.post('/search', async (req, res) => {
	try {
		await async_run(req, res, get_search_results);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.get('/admin', async (req, res) => {
	try {
		await async_run(req, res, plots);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/post', async (req, res) => {
	try {
		await async_run(req, res, create_post);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
})

app.post('/editprofile', async (req, res) => {
	try {
		await async_run(req, res, edit_profile);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
})

app.get('/about/:user', async (req, res) => {
	try {
		await async_run(req, res, get_timeline);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
})

app.get('/get_about/:user', async (req, res) => {
	try {
		await async_run(req, res, get_about);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
})

app.get('/editprofile', async (req, res) => {
	try {
		await async_run(req, res, get_profile_info);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});

app.post('/friends/check', async (req, res) => {
	try {
		await async_run(req, res, check_request);
	} catch (err) {
		res.json({ 'status': 'failure', 'message': 'Invalid User', 'verification': 'failed', 'result': null });
		console.log(err.stack);
	}
});
