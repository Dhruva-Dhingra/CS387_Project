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
		auto_user_id,
    checkIfExists,
    signup,
    login,
		verifyToken
} = require('./Views/login_signup');

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
		await auto_user_id();
    console.log(`Server running on port ${PORT}`);
});

app.post('/signup', async(req, res) => {
		let ex = await checkIfExists(req.body.email);
		if (!ex)
				signup(req, res);
		else console.log('Could not sign up!');
});

app.post('/login', async (req, res) => {
		let ans = await login(req, res);
		console.log('Received response', ans);
		res.cookie('accessToken', ans.accessToken, {
				secure: true,
				httpOnly: true
		});
		res.json(ans);
		// console.log('JSON response sent');
});

// app.post('/signup', (req, res) => {
// 		console.log('At signup backend!');
// 		console.log(req.body);
// });
// app.post('/login', (req, res) => {
// 		console.log('At login backend!');
// 		console.log(req.body);
// });
