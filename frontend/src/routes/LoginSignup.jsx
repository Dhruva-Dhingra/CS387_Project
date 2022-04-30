import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useNavigate } from 'react-router-dom';

async function sha256(message) {
	// encode as UTF-8
	const msgBuffer = new TextEncoder().encode(message);

	// hash the message
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// convert bytes to hex string                  
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

const LoginForm = () => {

	let history = useNavigate();
	let state = {
		email: '',
		password: '',
	}

	const handleChange = (e) => {
		try {
			e.preventDefault();
			state[e.target.name] = e.target.value;
		}
		catch (err) {
			console.log(err.stack);
		}
	}

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			state.password = await sha256(state.password);
			const requestOptions = {
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(state),
			};
			const res = fetch('http://localhost:8080/login', requestOptions)
				.then(res => res.json())
				.then(data => {
					history('/homepage');
				});
		}
		catch (err) {
			console.log(err.stack);
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3" controlId="formBasicEmail">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" name='email' placeholder="Enter email" onChange={handleChange} />
				<Form.Text className="text-muted">
					We'll never share your email with anyone else.
				</Form.Text>
			</Form.Group>
			<Form.Group className="mb-3" controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" name='password' placeholder="Password" onChange={handleChange} />
			</Form.Group>
			<Button variant="primary" type="submit">
				Submit
			</Button>
		</Form>
	);
}

class SignupForm extends Component {
	constructor() {
		super();

		this.state = {
			first_name: '',
			last_name: '',
			roll_number: '',
			branch: '',
			degree: '',
			batch: '',
			email: '',
			hash_of_password: '',
			residence: '',
			birthday: '',
			profile_picture: '',

		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		try {
			e.preventDefault();
			this.setState({
				[e.target.name]: e.target.value,
			});
		}
		catch (err) {
			console.log(err.stack);
		}
	}

	handleSubmit = async (e) => {
		try {
			this.setState({
				'birthday' : Date(this.state.birthday)
			});
			this.setState({
				'birthday' : this.state.birthday.toISOString().slice(0,19).replace("T"," ")
			})


			e.preventDefault();
			var profile_pic;
			var dp_file_element = document.getElementById("file-selector");
			var temp_state = this.state;
			if (dp_file_element.files.length > 0) {
				var reader = new FileReader();
				reader.onloadend = async function () {
					// console.log("Reader = ", reader);
					// console.log("Reader.result = ", reader.result);
					profile_pic = reader.result;
					var len = profile_pic.length;
					profile_pic = profile_pic.slice(23, len - 1);
					temp_state.profile_picture = profile_pic;
					// this.state.password = await sha256(this.state.password);
					temp_state.hash_of_password = await sha256(temp_state.hash_of_password);
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(temp_state),
					};
					fetch('http://localhost:8080/signup', requestOptions)
						.then(response => {
							response.json();
						});
					// var imgElement = document.getElementById("checking_image_file");
					// imgElement.src = reader.result;
				}
				reader.readAsDataURL(dp_file_element.files[0]);
			}
			else{
				profile_pic = null;
				this.setState({
					'profile_picture': profile_pic,
				});
				console.log(this.state);
				this.setState({
					'hash_of_password' : await sha256(this.state.hash_of_password)
				});
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(this.state),
				};
				fetch('http://localhost:8080/signup', requestOptions)
					.then(response => {
						response.json();
					});
				}
		}
		catch (err) {
			console.log(err.stack);
		}
	}

	render() {
		return (
			<div>
				<center>Sign up!</center>
				<form onSubmit={this.handleSubmit} className="was-validated">


					<div className="col">
						First Name:
						<input required type='text' className='form-control' name='first_name' value={this.state.first_name} placeholder='Your First Name' onChange={this.handleChange} />
					</div>

					<div className='col'>
						Last Name:
						<input type='text' className='form-control' name='last_name' placeholder='Your Last Name' value={this.state.last_name} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Roll Number:
						<input required type='text' className='form-control' name='roll_number' placeholder='Roll Number' value={this.state.roll_number} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Branch:
						<input required type='text' className='form-control' name='branch' placeholder='Branch' value={this.state.branch} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Degree:
						<input required type='text' className='form-control' name='degree' placeholder='Degree' value={this.state.degree} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Batch:
						<input required type='number' className='form-control' name='batch' placeholder='Batch' value={this.state.batch} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Email-ID:
						<input required type='text' className='form-control' name='email' placeholder='Enter your Email-ID' value={this.state.email} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Password:
						<input required type='password' className='form-control' name='hash_of_password' placeholder='Password' value={this.state.hash_of_password} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Residence:
						<input type='text' className='form-control' name='residence' placeholder='Residence' value={this.state.residence} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Birthday:
						<input required type='date' className='form-control' name='birthday' placeholder='Birthday' value={this.state.birthday} onChange={this.handleChange} />
					</div>
					<div className='col'>
						Profile Picture:
						<input type="file" className='form-control' placeholder='Profile Picture' id="file-selector" accept=".jpg, .jpeg, .png" />
					</div>
					<br />
					<center><input type='submit' className="btn btn-warning btn-lg" value='Submit'></input></center>
				</form>
			</div>
		);
	}

}

class LoginSignup extends Component {
	constructor() {
		super();
		this.state = {
			isLogin: true,
		}
		this.loginClick = this.loginClick.bind(this);
		this.signupClick = this.signupClick.bind(this);
	}

	loginClick() {
		try {
			this.setState({
				isLogin: true
			});
		}
		catch (err) {
			console.log(err.stack);
		}

	}

	signupClick() {
		try {
			this.setState({
				isLogin: false
			});
		}
		catch (err) {
			console.log(err.stack);
		}
	}


	render() {
		let form;
		form = this.state.isLogin ? <LoginForm /> : <SignupForm />;

		return (
			<Tabs defaultActiveKey="login" id="uncontrolled-tab-example" className="mb-3">
				<Tab eventKey="login" title="Login">
					<LoginForm />
				</Tab>
				<Tab eventKey="signup" title="Sign Up">
					<SignupForm />
				</Tab>
			</Tabs>
		);
	}
}

export default LoginSignup;
