import React, { Component } from 'react';
import { connect } from 'react-redux';
import DestinationCard from './DestinationCard';
import DestinationCardLite from './DestinationCardLite';
import { Card } from 'semantic-ui-react';
import '../stylesheets/destinations.css';

class DestinationsContainer extends Component {
	state = { targetDestination: {} };

	componentWillReceiveProps(nextProps) {
		this.setState({ targetDestination: nextProps.targetDestination });
	}

	returnCards = (d, i) => {
		return d.id === this.state.targetDestination.id ? (
			<DestinationCard destination={d} />
		) : (
			<DestinationCardLite destination={d} />
		);
	};

	render() {
		return (
			<div id="destinations-container">
				{this.props.destinations
					? this.props.destinations.map((d, i) => (
							<Card.Group id="dest-cards" key={i}>
								{this.returnCards(d, i)}
							</Card.Group>
					  ))
					: 'No destination has been added (yet...)'}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	targetDestination: state.trip.targetDestination,
	destinations: state.trip.targetTrip.destinations
});

export default connect(mapStateToProps)(DestinationsContainer);
