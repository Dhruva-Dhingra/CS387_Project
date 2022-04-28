import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import Button  from 'react-bootstrap/Button';

class Recommendations extends Component {
		constructor (props) {
				super(props);
				this.state = {
						recommendations: null,
						loaded: false,
				}
				this.getRecoms = this.getRecoms.bind(this);
				this.sendRequest = this.sendRequest.bind(this);
		}

		getRecoms() {
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

		componentDidMount() {
				this.getRecoms();
		}

		removeRecommendation (user_id) {
				for (let i = 0; i < this.state.recommendations.length(); i++) {
						if (this.state.recommendations[i].user_id == user_id) {
								this.setState({
										recommendations: this.state.recommendations.splice(i, 1),
								});
						}
				}
		}

		sendRequest(acceptor_id) {
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
								}
						});
		}

		render() {
				console.log('Recommendations', this.state.recommendations);
				let recoms = null;
				if (this.state.recommendations) {
						recoms = this.state.recommendations.map((el) => <ListGroup.Item className="d-flex justify-content-between align-items-start">
																														{el.user_id}
																																<Button variant='primary' onClick={this.sendRequest(el.user_id)}>Send</Button>
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

class Invitations extends Component {
		constructor (props) {
				super(props);

				this.state = {
						invitations: null
				}
				this.getInvits = this.getInvits.bind(this);
				this.acceptRequest = this.acceptRequest.bind(this);
				this.declineRequest = this.declineRequest.bind(this);
		}

		async getInvits() {
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

		componentDidMount() {
				this.getInvits();
		}

		removeInvitation (user_id) {
				for (let i = 0; i < this.state.invitations.length(); i++) {
						if (this.state.invitations[i].user_id == user_id) {
								this.setState({
										invitations: this.state.nvitations.splice(i, 1),
								});
						}
				}
		}

		acceptRequest (sender_id) {
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
									}
							});
		}

		declineRequest (sender_id) {
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
									}
							});
		}

		render() {
				console.log('Invitations', this.state.invitations);
				let invits = null;
				if (this.state.invitations) {
						invits = this.state.invitations.map((el) => <ListGroup.Item className="d-flex justify-content-between align-items-start">
																														{el.user_id}
																														<Button variant='primary' onClick={this.acceptRequest(el.user_id)}>Accept</Button>
																														<Button variant='secondary' onClick={this.declineRequest(el.user_id)}>Decline</Button>
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
				this.setState({
						disp: <Recommendations />
				});
		}

		invitClick() {
				this.setState({
						disp: <Invitations />
				});
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
