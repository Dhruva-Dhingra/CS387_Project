const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const login_signup = require ('./Views/login_signup')
var corsOptions = {
    origin: 'http://localhost:3000'
};


app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to our project!'});
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// app.post('/signup', [login_signup.checkIfExists], login_signup.signup);
// app.post('./login', login_signup.login);

app.post('/signup', (req, res) => {
		console.log('At signup backend!');
		console.log(req.body);
});
app.post('/login', (req, res) => {
		console.log('At login backend!');
		console.log(req.body);
});
