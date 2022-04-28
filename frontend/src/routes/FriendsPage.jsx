import React, { Component } from 'react';

class Recommendations extends Component {

		constructor (props) {
				super(props);
				this.state = {
						recommendations: null,
						loaded: false,
				}
				this.getRecoms = this.getRecoms.bind(this);
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

		render() {
				if (!this.state.loaded) {
						this.setState({
								loaded: true
						});
						this.getRecoms();
				}
				console.log('Recommendations', this.state.recommendations);
				let recoms = null;
				if (this.state.recommendations) {
						recoms = this.state.recommendations.map((el) => <li key={el.user_id}>{el.user_id}</li>);
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
				this.getInvits();
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

		render() {
				if (!this.state.loaded) {
						this.setState({
								loaded: true
						});
						this.getInvits();
				}
				console.log('Invitations', this.state.invitations);
				let invits = null;
				if (this.state.invitations) {
						invits = this.state.invitations.map((el) => <li key={el.user_id}>{el.user_id}</li>);
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
						<div>
								<button onClick = {this.invitClick} class = 'btn btn-primary'>Invitations</button>
								<button onClick = {this.recomClick} class = 'btn btn-secondary'>Recommendations</button>
						{this.state.disp}
						</div>
				);
		}
}

export default RecomInvit;
