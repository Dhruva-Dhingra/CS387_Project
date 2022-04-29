import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class LoginForm extends Component {
		constructor() {
				super();

				this.state = {
						email: '',
						password: '',
				};
				this.handleSubmit = this.handleSubmit.bind(this);
				this.handleChange = this.handleChange.bind(this);
		}

		handleChange(e) {
				e.preventDefault();
				this.setState({
						[e.target.name]: e.target.value,
				});
		}

		async handleSubmit(e) {
				e.preventDefault();
				console.log('Sending to backend!');
				console.log(this.state);
				const requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify(this.state),
				};
				const res = await fetch('http://localhost:8080/login', requestOptions)
				let data = await res.json();

				console.log(data);

		}

		render() {
				return (
						<Form>
								<Form.Group className="mb-3" controlId="formBasicEmail">
										<Form.Label>Email address</Form.Label>
										<Form.Control type="email" placeholder="Enter email" />
										<Form.Text className="text-muted">
												We'll never share your email with anyone else.
										</Form.Text>
								</Form.Group>	
								<Form.Group className="mb-3" controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control type="password" placeholder="Password" />
								</Form.Group>
								<Button variant="primary" type="submit">
										Submit
								</Button>
						</Form>
				);
		}
}

class SignupForm extends Component {
		constructor() {
				super();

				this.state = {
						// firstname: null,
						// lastname: null,
						// rollno: null,
						// branch: null,
						// degree: null,
						// batch: null,
						email: '',
						password: '',
						// residence: null,
						// birthday: null,
						// profile_pic: null,
						// pvt: null,
						// autoadd: null,
				}
				this.handleSubmit = this.handleSubmit.bind(this);
				this.handleChange = this.handleChange.bind(this);
		}

		handleChange(e) {
				e.preventDefault();
				console.log('Change in signup form');
				this.setState({
						[e.target.name]: e.target.value,
				});
				console.log(this.state);
		}
		
		handleSubmit(e) {
				e.preventDefault();
				console.log('Sending to backend!');
				console.log(this.state);
				const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json'},
						body: JSON.stringify(this.state),
				};
				fetch('http://localhost:8080/signup', requestOptions)
						.then(response => {
								response.json();
								console.log(response);
						});
		}

		render() {
				return (
						<div>
								<p>Please sign up!</p>
								<br/>
								<form onSubmit = {this.handleSubmit}  class="was-validated">
										
										
										<div className="col">
												First Name:
												<input type = 'text' className='form-control' name = 'email' value = {this.state.email} placeholder = 'Enter email' onChange = {this.handleChange} />
										</div>
		
										<div className='col'>
												Last Name:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Roll Number:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Branch:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Degree:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Batch:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Email-ID:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Password:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Residence:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Birthday:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<div className='col'>
												Profile Picture:
												<input type = 'password' className='form-control' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</div>
										<br/>
										<center><input type = 'submit' value ='Submit'></input></center>
								</form>
						</div>
				);
		}

}

class LoginSignup extends Component {
		constructor () {
				super();
				this.state = {
						isLogin: true,
				}
				this.loginClick = this.loginClick.bind(this);
				this.signupClick = this.signupClick.bind(this);
		}

		loginClick() {
				this.setState({
						isLogin: true
				});
				console.log(this.state.isLogin);
		}

		signupClick () {
				this.setState({
						isLogin: false
				});
				console.log(this.state.isLogin);
		}


		render () {
				let form;
				form = this.state.isLogin? <LoginForm />: <SignupForm />;

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
