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
				console.log('Sending...');
				const res = await fetch('http://localhost:8080/login', requestOptions)
				let data = await res.json();
				document.cookie = `user_id=${data.id}`;
				console.log(data);
				console.log(data);
				const reqOpt = {
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
				};

				const resp = await fetch('http://localhost:8080/friends/recommendations', reqOpt)
				const dat = await resp.json();
				console.log(dat);
		}

		render() {
				return (
						<div>
								<p>Please Login!</p>
								<br/>
								<form onSubmit = {this.handleSubmit}>
										<label>
												Email:
												<input type = 'email' name = 'email' value = {this.state.email} onChange = {this.handleChange} />
										</label>
										<br/>
										<label>
												Password:
												<input type = 'password' name = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</label>
										<br/>
										<input type = 'submit' value ='Submit'></input>
								</form>
						</div>
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
							
									
										<label class="col-sm-12 controls">
												Email:
												<input type = 'text' name = 'email' value = {this.state.email} placeholder = 'Enter email' onChange = {this.handleChange} />
										</label>
										<br/>
										<label>
												Password:
												<input type = 'password' name = 'password' placeholder = 'password' value = {this.state.password} onChange = {this.handleChange} />
										</label>
										<br/>
										<input type = 'submit' value ='Submit'></input>
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
						<div>
						 		{form}
							
						 		<button onClick = {this.loginClick} class="btn btn-success">Login</button>
						 		<button onClick = {this.signupClick} class="btn btn-primary">Signup</button>
						</div>
				)
		}
}

export default LoginSignup;
