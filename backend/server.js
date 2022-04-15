const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const login_signup = require ('./Views/login_signup')
var corsOptions = {
    origin: 'http://localhost:3001'
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

app.post('/signup', [login_signup.checkIfExists], login_signup.signup);
app.post('./login', login_signup.login);
