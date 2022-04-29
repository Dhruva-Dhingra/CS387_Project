import React, { Component, useCallback } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

class Recom extends Component {
		constructor (props) {
				super(props);
				this.history = this.props.history;
				this.state = {
						recommendations: null,
						loaded: false,
				}
				this.getRecoms = this.getRecoms.bind(this);
				this.sendRequest = this.sendRequest.bind(this);
				this.goToTimeline = this.goToTimeline.bind(this);
		}

		getRecoms() {
			try{
				const reqOpt = {
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
				};

				fetch('http://localhost:8080/friends/recommendations', reqOpt)
						.then(resp => resp.json())
						.then(dat => this.setState({recommendations: dat}));
					}
					catch (err) {
						console.log(err.stack);
		}
		}

		componentDidMount() {
			try{
				this.getRecoms();
			}
			catch (err) {
				console.log(err.stack);
}
		}

		removeRecommendation (user_id) {
			try{
				this.setState({
						recommendations: this.state.recommendations.filter((el) => el.user_id != user_id),
				});
			}
			catch (err) {
				console.log(err.stack);
}
		}

		sendRequest(acceptor_id) {
			try{
				console.log('Request sent');
				let tm = new Date();
				let data = {
						user_id: acceptor_id,
						time: tm
				};
				let requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify(data),
				};
				fetch('http://localhost:8080/friends/send', requestOptions)
							.then(res => res.json())
						.then(dat => {
								console.log(dat);
								if (dat.status != 'failure') {
										console.log('Here');
										this.removeRecommendation(acceptor_id);
										console.log('Modified recommendations:', this.state.recommendations);
								}
						});
					}
					catch (err) {
						console.log(err.stack);
		}
		}

		goToTimeline(user_id) {
			try{
				this.history(`/timeline/${user_id}`, {replace: true});
			}
			catch (err) {
				console.log(err.stack);
}
		}

		render() {
				console.log('Recommendations', this.state.recommendations);
				let recoms = null;
				if (this.state.recommendations) {
						recoms = this.state.recommendations.map((el) => <ListGroup.Item className="d-flex justify-content-between align-items-start">
																														<div className="ms-2 me-auto">
																																<div className="fw-bold" onClick={() => {this.goToTimeline(el.user_id)}}>{el.first_name} {el.last_name}</div>
																																{el.roll_number}
																														</div>
																																<Button variant='primary' onClick={() => {this.sendRequest(el.user_id)}}>Send Friend Request</Button>
																												</ListGroup.Item>);
				}
				return (
						<div>
								<p> Friend recommendations!</p>
								<br/>
								<ul>{recoms}</ul>
						</div>
				);
		}
}

const Recommendations = (props) => {
	
		const history = useNavigate();

		return <Recom {...props} history={history} />
}

class Invit extends Component {
		constructor (props) {
				super(props);

				this.history = this.props.history;

				this.state = {
						invitations: null
				}
				this.getInvits = this.getInvits.bind(this);
				this.acceptRequest = this.acceptRequest.bind(this);
				this.goToTimeline = this.goToTimeline.bind(this);
				this.declineRequest = this.declineRequest.bind(this);
		}

		async getInvits() {
			try{
				const reqOpt = {
						method: 'GET',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
				};

				let resp = await fetch('http://localhost:8080/friends/invitations', reqOpt)
						.then(resp =>resp.json())
						.then(dat => this.setState({invitations: dat}));
					}
					catch (err) {
						console.log(err.stack);
		}
		}

		componentDidMount() {
			try{
				this.getInvits();
			}
			catch (err) {
				console.log(err.stack);
}
		}

		removeInvitation (user_id) {
			try{
				this.setState({
						invitations: this.state.invitations.filter((el) => el.user_id != user_id),
				});
			}
			catch (err) {
				console.log(err.stack);
}
		}

		acceptRequest (sender_id) {
			try{
				console.log('Accepted request');
				let tm = new Date();
				let data = {
						user_id: sender_id,
						time: tm
				};
				let requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify(data),
				};
				fetch('http://localhost:8080/friends/accept', requestOptions)
							.then(res => res.json())
							.then(dat => {
									if (dat.status != 'failure') {
											this.removeInvitation(sender_id);
											console.log('Modified recommendations:', this.state.recommendations);
									}
							});
						}
						catch (err) {
							console.log(err.stack);
			}
		}

		declineRequest (sender_id) {
			try {
				console.log('Declined request');
				let tm = new Date();
				let data = {
						user_id: sender_id,
						time: tm
				};
				let requestOptions = {
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
						headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify(data),
				};
				fetch('http://localhost:8080/friends/decline', requestOptions)
							.then(res => res.json())
							.then(dat => {
									if (dat.status != 'failure') {
											this.removeInvitation(sender_id);
											console.log('Modified recommendations:', this.state.recommendations);
									}
							});
						}
						catch (err) {
							console.log(err.stack);
			}
		}

    goToTimeline(user_id) {
		try{
				this.history(`/timeline/${user_id}`, {replace: true});
			}
			catch (err) {
				console.log(err.stack);
}
		}

		render() {
				console.log('Invitations', this.state.invitations);
				let invits = null;
				if (this.state.invitations) {
						invits = this.state.invitations.map((el) => <ListGroup.Item className="d-flex justify-content-between align-items-start">
																														<div className="ms-2 me-auto">
																																<div className="fw-bold" onClick={() => {this.goToTimeline(el.user_id)}}>{el.first_name} {el.last_name}</div>
																																{el.roll_number}
																														</div>
																														<Button variant='primary' onClick={() => {this.acceptRequest(el.user_id)}}>Accept Friend Request</Button>
																														<Button variant='secondary' onClick={() => {this.declineRequest(el.user_id)}}>Decline Friend Request</Button>
																												</ListGroup.Item>);
				}
				return (
						<div>
								<p> Friend invitations!</p>
								<br/>
								<ul>{invits}</ul>
						</div>
				);
		}
}

const Invitations = (props) => {
		const history = useNavigate();

		return <Invit history={history} />
}

class RecomInvit extends Component {
		constructor(props) {
				super(props);
				this.state = {
						disp: <Recommendations />
				}
				this.recomClick = this.recomClick.bind(this);
				this.invitClick = this.invitClick.bind(this);
		}

		recomClick() {
			try{
				this.setState({
						disp: <Recommendations />
				});
			
			}
				catch (err) {
					console.log(err.stack);
	}
		}

		invitClick() {
			try{
				this.setState({
						disp: <Invitations />
				});
			}
			catch (err) {
				console.log(err.stack);
}
		}

		render() {
				return (
<Tabs defaultActiveKey="recom" id="uncontrolled-tab-example" className="mb-3">
		<Tab eventKey="recom" title="Recomendations">
			<Recommendations />
  </Tab>
		<Tab eventKey="invit" title="Invitations">
			<Invitations />
  </Tab>
</Tabs>
				);
		}
}

export default RecomInvit;
