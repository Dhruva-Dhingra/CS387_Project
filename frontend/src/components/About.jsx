import React, { Component, useState, useContext, useEffect } from 'react';
// import TimelineFinder
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";
import AboutFinder from '../apis/AboutFinder';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class FriendButton extends Component {
		constructor(props) {
				super(props);
				this.state = {
						'message': null
				}
				this.user_id = this.props.user_id;
				this.sendRequest = this.sendRequest.bind(this);
				this.acceptRequest = this.acceptRequest.bind(this);
				this.declineRequest = this.declineRequest.bind(this);
				this.check = this.check.bind(this);
				console.log('User id:', this.user_id);
		}

		sendRequest () {
			try{
				let tm = new Date();
				const requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify({'user_id': this.user_id, 'time': tm}),
				};
				try {
						fetch('http://localhost:8080/friends/send', requestOptions)
								.then(res => res.json())
								.then(data => console.log(data));
				} catch (err) {
						console.log(err.stack);
				}}
				catch (err) {
						console.log(err.stack);
		}}

		acceptRequest () {
			try{
				let tm = new Date();
				const requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify({'user_id': this.user_id, 'time': tm}),
				};
				try {
						fetch('http://localhost:8080/friends/accept', requestOptions)
								.then(res => res.json())
								.then(data => {
										this.setState({
												'message': 'already friends',
										})
										console.log(data)
								});
				} catch (err) {
						console.log(err.stack);
				}}
				catch (err) {
					console.log(err.stack);
	}
		}

		declineRequest () {
			try{
				let tm = new Date();
				const requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify({'user_id': this.user_id, 'time': tm}),
				};
				try {
						fetch('http://localhost:8080/friends/decline', requestOptions)
								.then(res => res.json())
								.then(data => {
										this.setState({
												'message': 'request possible',
										})
										console.log(data)
								});
				} catch (err) {
						console.log(err.stack);
				}
			}
			catch (err) {
				console.log(err.stack);
}
		}

		check () {
			try{
				let data = {
						user_id: this.user_id,
				}
				console.log('Data:', data);
				const requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify(data),
				};
				try {
						fetch('http://localhost:8080/friends/check', requestOptions).then(async res => {
								let ans = await res.json();
								return ans.message;
						})
								.then(message => {
										console.log('Message:', message);
										this.setState({
												'message': message
										})
								});
				} catch (err) {
						console.log(err.stack);
				}
			}
			catch (err) {
				console.log(err.stack);
}
		}

		componentDidMount () {
			try{
				this.check();
			}
			catch (err) {
				console.log(err.stack);
}
		}

		render () {
			// TRY CATCH
				let friend_btn = <br />
				if (this.state.message == 'request received') {
						friend_btn = <div><Button variant='primary' onClick={this.acceptRequest}>Accept Friend Request</Button>{ }<Button variant='secondary' onClick={this.declineRequest}>Decline Friend Request</Button></div>;
				}
				else if (this.state.message == 'request possible') {
						friend_btn = <Button variant='primary' onClick={this.sendRequest}>Send Friend Request</Button>;
				}
				return <div>{friend_btn}</div>;
		}
}

const DisplayAbout = () => {
    const {id} = useParams();
    const {poststm, setPoststm} = useContext(Context);
		let user_id = poststm[0].user_id;
		console.log('User id in parent component:', user_id);
    console.log("HIHIHIHI");
    let history = useNavigate();
    var loaded = false;
    useEffect( ()=> {
        const fetchData = async () => {
            try {
           const response = await  AboutFinder.get(`/${id}`, {
            start: 1,
            end : 2,
           })
    .then(response => {
        if(response.data.status === "success"){
      
        console.log("HIHIHIHI");
// console.log(response.data.result)
			var imgobbj = document.getElementById("profile_photo_box");
			// console.log("Created new image placeholder");
			// var len = response.data.result[0].profile_picture.length;
			// console.log(response.data.result[0].profile_picture.slice(len - 10, len - 1));
			// imgobbj.src = "data:text/css;base64,"+response.data.result[0].profile_picture.slice(1, response.data.result[0].profile_picture.length - 1);
			imgobbj.src = "data:text/css;base64,"+response.data.result[0].profile_picture;
			console.log("Added source to image holder");
			// var return_ = document.body.appendChild(newimg);
                setPoststm(response.data.result);
                console.log(poststm);
                console.log("HI");
                loaded = true;
                console.log("About get succesful");
        } else {
        console.log("About get unsuccessful");
        }
    });
    
            } catch (err) {
                console.log(err.stack);
            }
        }
        fetchData();
    },[]);

    return <div className='list-group'>
        <img id="profile_photo_box" class="rounded float-left" width="200" height="200"></img>
        <br>
        </br>
							 {user_id ? <FriendButton user_id={user_id} />: <br />}
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              {/* <th scope = "col">Post ID</th> */}
              <th scope = "col">Details</th>
              <th scope = 'col'>Value</th>
          </tr>
        </thead>
        <tbody>
            <tr><td>Name</td><td>{poststm[0].first_name} {poststm[0].last_name}</td></tr>
            <tr><td>Email</td><td>{poststm[0].email}</td></tr>
            <tr><td>Roll Number</td><td>{poststm[0].roll_number}</td></tr>
            <tr><td>Branch</td><td>{poststm[0].branch}</td></tr>
            <tr><td>Degree</td><td>{poststm[0].degree}</td></tr>
            <tr><td>Batch</td><td>{poststm[0].batch}</td></tr>
            <tr><td>Residence</td><td>{poststm[0].residence}</td></tr>
            <tr><td>Birthday</td><td>{poststm[0].birthday}</td></tr>
        </tbody>
    </table>
  
    </div>

}

export default DisplayAbout;
