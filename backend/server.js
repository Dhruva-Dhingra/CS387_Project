const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
var corsOptions = {
    origin: 'http://localhost:3000'
};

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));


const {
		auto_user_id,
    checkIfExists,
    signup,
    login
} = require('./Views/login_signup');

app.get('/', async (req, res) => {
    res.json({ message: 'Welcome to our project!'});
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
		res.json(ans);
});

// app.post('/signup', (req, res) => {
// 		console.log('At signup backend!');
// 		console.log(req.body);
// });
// app.post('/login', (req, res) => {
// 		console.log('At login backend!');
// 		console.log(req.body);
// });
