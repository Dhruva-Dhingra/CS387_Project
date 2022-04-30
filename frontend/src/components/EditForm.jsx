import React, { Component, useState, useContext, useEffect } from 'react';
import EditFinder from '../apis/EditFinder';
import { Context } from '../context/Context';
import Form from 'react-bootstrap/Form';


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

class EditForm extends Component {
	constructor() {
		super();
		this.state = {
			'user_id': '',
			'first_name': '',
			'last_name': '',
			'roll_number': '',
			'branch': '',
			'degree': '',
			'batch': '',
			'email': '',
			'hash_of_password': '',
			'residence': '',
			'birthday': '',
			'profile_picture': '',
			'private': '',
			'autoadd_to_groups': '',
		}
		this.head = {
			color: '#7c795d', 'fontFamily': 'Trocchi',
			'fontSize': '60px', 'fontWeight': 'normal', 'lineHeight': '48px',
			'textAlign': 'center'
		}
		this.head2 = {
			color: '#7c795d', 'fontFamily': 'Trocchi',
			'fontSize': '40px', 'fontWeight': 'normal', 'lineHeight': '48px',
			'textAlign': 'center'
		}
		this.getData = this.getData.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getData() {
		const reqOpt = {
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		};
		fetch('http://localhost:8080/editprofile', reqOpt)
			.then(async res => { let ans = await res.json(); return ans.data; })
			.then(data => {
				this.setState(data);
			});
	}

	componentDidMount() {
		this.getData();
	}

	handleChange(e) {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	handleSubmit = async(e) => {
		e.preventDefault()
		var profile_pic;
		try {
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
					temp_state.hash_of_password = await sha256(temp_state.hash_of_password);
					const requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(temp_state),
					};

					fetch('http://localhost:8080/editprofile', requestOptions)
						.then(async response => {
							let res = await response.json();
							if (res.status === "success") {
								console.log("Profile Edit Successful");
							} else {
								console.log("Profile Edit Unsuccessful");
							}
						});
					}
					// console.log(reader.result);
					// return reader.result;
					// var imgElement = document.getElementById("checking_image_file");
					// imgElement.src = reader.result;
				await reader.readAsDataURL(dp_file_element.files[0]);
			}
			else{
				profile_pic = null;
			// }
			// {
			
				this.setState({
					'profile_picture': profile_pic,
				})

				this.setState({
					'hash_of_password' : await sha256(this.state.hash_of_password)
				});
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

				fetch('http://localhost:8080/editprofile', requestOptions)
					.then(async response => {
						let res = await response.json();
						if (res.status === "success") {
							console.log("Profile Edit Successful");
						} else {
							console.log("Profile Edit Unsuccessful");
						}
					});
				}

		} catch (err) {
			console.log(err.stack);
		}
	}

	render() {
		return <div className='mb-4'>
			<h1 style={this.head2}>Edit your profile Here! </h1>
			<form action="">
				<div className="form-row">
					<div className="col">
						<input value={this.state.first_name} name='first_name' onChange={this.handleChange} type="text" className='form-control' placeholder='First Name' />
					</div>
					<div className="col">
						<input value={this.state.last_name} name='last_name' onChange={this.handleChange} type="text" className='form-control' placeholder='Last Name' />
					</div>
					<div className="col">
						<input value={this.state.roll_number} name='roll_number' onChange={this.handleChange} type="text" className='form-control' placeholder='Roll Number' />
					</div>
					<div className="col">
						<input value={this.state.branch} name='branch' onChange={this.handleChange} type="text" className='form-control' placeholder='Branch' />
					</div>
					<div className="col">
						<input value={this.state.degree} name='degree' onChange={this.handleChange} type="text" className='form-control' placeholder='Degree' />
					</div>
					<div className="col">
						<input value={this.state.batch} name='batch' onChange={this.handleChange} type="number" className='form-control' placeholder='Batch' />
					</div>
					<div className="col">
						<input value={this.state.email} name='email' onChange={this.handleChange} type="email" className='form-control' placeholder='Email-ID' />
					</div>
					<div className="col">
						<input value={this.state.hash_of_password} name='hash_of_password' onChange={this.handleChange} type="password" className='form-control' placeholder='Password' />
					</div>
					<div className="col">
						<input value={this.state.residence} name='residence' onChange={this.handleChange} type="text" className='form-control' placeholder='Residence' />
					</div>
					<div className="col">
						<input value={this.state.birthday} name='birthday' onChange={this.handleChange} type="date" className='form-control' placeholder='Birthday' />
					</div>
					<div className="col">
						<input type="file" className='form-control' placeholder='Profile Picture' id="file-selector" accept=".jpg, .jpeg, .png" />
					</div>
					<Form.Check
						type="switch"
						id="custom-switch"
						label="Autoadd to Groups"
						value={this.state.autoadd_to_groups}
						name='autoadd_to_groups'
						onChange={this.handleChange}
					/>
					<Form.Check
						type="switch"
						id="custom-switch"
						label="Private Account"
						value={this.state.private}
						name='private'
						onChange={this.handleChange}
					/>
					<br></br>
					<center><button onClick={this.handleSubmit} type="submit" className="btn btn-warning btn-lg">Update Profile!</button></center>

				</div>
			</form>
		</div>;
	}
}

export default EditForm;
