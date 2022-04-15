import React, { Component } from 'react';

class LoginForm extends Component {
		constructor() {
				super();

				this.state = {
						email: null,
						password: null,
				};
				this.handleSubmit = this.handleSubmit.bind(this);
				this.handleChange = this.handleChange.bind(this);
		}

		handleChange(e) {
				e.preventDefault();
				console.log('Change in login form');
				this.setState({
						[e.target.name]: e.target.value,
				});
				console.log('Target:', e.target)
				console.log(this.state);
		}

		handleSubmit(e) {
				e.preventDefault();
				console.log('Sending to backend!');
				console.log(this.state);
				// const requestOptions = {
				// 		method: 'POST',
				// 		headers: { 'Content-Type': 'application/json'},
				// 		body: JSON.stringify(e.state),
				// };
				// fetch('localhost:8080/login_signup', requestOptions)
				// 		.then(response => {
				// 				response.json();
				// 				console.log(response);
				// 		});
		}

		render() {
				return (
								<form onSubmit = {this.handleSubmit}>
								<label>
								Email:
										<input type = 'text' name = 'email' value = {this.state.email} onChange = {this.handleChange} />
								</label>
								<label>
								Password:
										<input type = 'text' name = 'password' value = {this.state.password} onChange = {this.handleChange} />
								</label>
								<input type = 'submit' value ='Submit'></input>
								</form>
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
						email: null,
						password: null,
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
						email: e.target.email,
						password: e.target.password
				});
				console.log(this.state);
		}
		
		handleSubmit(e) {
				e.preventDefault();
				console.log('Sending to backend!');
				console.log(this.state);
				// const requestOptions = {
				// 		method: 'POST',
				// 		headers: { 'Content-Type': 'application/json'},
				// 		body: JSON.stringify(e.state),
				// };
				// fetch('localhost:8080/login_signup', requestOptions)
				// 		.then(response => {
				// 				response.json();
				// 				console.log(response);
				// 		});
		}

		render() {
				return (
						// <div>Login</div>
								<form onSubmit = {this.handleSubmit}>
								<label>
								Email:
								<input type = 'text' value = {this.state.email} onChange = {this.handleChange} />
								</label>
								<label>
								Password:
								<input type = 'text' value = {this.state.password} onChange = {this.handleChange} />
								</label>
								<input type = 'submit' value ='Submit'></input>
								</form>
				);
		}

}

class LoginSignup extends Component {
		constructor () {
				super();
				this.state = {
						isLogin: true,
				}
		}

		render () {
				const isLogin = this.state.isLogin;
				let form;
				form = isLogin? <LoginForm />: <SignupForm />;

				return (
						<div>
						 		{form}
						 		<button onClick = {() => {this.setState({isLogin: true});}}>Login</button>
								<button onClick = {() => {this.setState({isLogin: false});}}>Signup</button>
						</div>
				)
		}
}

export default LoginSignup;
