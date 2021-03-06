import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editTrip } from '../actions/tripActions';
import { Form, Button, Rating } from 'semantic-ui-react';
// import { GM_GEO_KEY } from '../config.js';
import '../stylesheets/trip.css';

let debounceFetch;

const defaultDestinationObj = {
	name: '',
	description: '',
	arrival: '',
	departure: '',
	lat: 0,
	lng: 0
};

class EditTripForm extends Component {
	state = {
		id: this.props.targetTrip.id,
		name: this.props.targetTrip.name,
		description: this.props.targetTrip.description,
		duration: this.props.targetTrip.duration,
		startDate: this.props.targetTrip.startDate,
		endDate: this.props.targetTrip.endDate,
		ratings: this.props.targetTrip.ratings,
		destinations: this.props.targetTrip.destinations
	};

	handleTripChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	addDestinationField = e => {
		if (this.state.destinations[this.state.destinations.length - 1].name) {
			this.setState({
				destinations: [...this.state.destinations, defaultDestinationObj]
			});
		}
	};

	removeDestinationField = index => () => {
		this.setState({
			destinations: [...this.state.destinations].filter((d, i) => i !== index)
		});
	};

	handleDestinationChange = index => e => {
		clearTimeout(debounceFetch);
		debounceFetch = setTimeout(this.fetchLatLng(e.target.value, index), 2000);
		const newDestinations = this.state.destinations.map(
			(d, i) => (i !== index ? d : { ...d, [e.target.name]: e.target.value })
		);
		this.setState({ destinations: newDestinations });
	};

	fetchLatLng = (address, index) => {
		fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
				process.env.REACT_APP_GM_GEO_KEY
			}`
		)
			.then(res => res.json())
			.then(json => {
				if (json.results.length) {
					const newDestinationsWithLatLng = this.state.destinations.map(
						(d, i) =>
							i !== index
								? d
								: {
										...d,
										lat: json.results[0].geometry.location.lat.toFixed(3),
										lng: json.results[0].geometry.location.lng.toFixed(3)
								  }
					);
					this.setState({ destinations: [...newDestinationsWithLatLng] });
				}
			});
	};

	handleRatings = (e, { rating }) => this.setState({ ratings: rating });

	handleTripChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleStartDateChange = day => {
		this.setState({ startDate: day });
	};

	handleEndDateChange = day => {
		// convert duration from seconds to days
		const duration = (day - new Date(this.state.startDate)) / 86400000 + 1;
		this.setState({ endDate: day, duration: duration });
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.editTrip(this.state);
		this.props.toggleEdit();
	};

	render() {
		return (
			<div>
				<h3>Edit Trip</h3>
				<Form onSubmit={this.handleSubmit} className="sidebar-form">
					<Form.Group>
						<Form.Input
							name="name"
							value={this.state.name}
							onChange={this.handleTripChange}
							width={16}
						/>
					</Form.Group>
					<Form.Group>
						<Form.TextArea
							name="description"
							value={this.state.description}
							onChange={this.handleTripChange}
							width={16}
						/>
					</Form.Group>
					<Form.Group inline unstackable widths="equal">
						<Form.Input
							type="date"
							name="startDate"
							label="Start Date"
							value={this.state.startDate}
							onChange={this.handleTripChange}
						/>
						<Form.Input
							type="date"
							name="endDate"
							label="End Date"
							value={this.state.endDate}
							onChange={this.handleTripChange}
						/>
					</Form.Group>
					<Form.Group>
						Ratings:
						<Rating
							icon="star"
							maxRating={5}
							onRate={this.handleRatings}
							value={this.state.ratings}
						/>
					</Form.Group>
					<h3>Destinations</h3>
					{this.state.destinations.map((d, i) => (
						<div key={i}>
							<input
								type="button"
								onClick={this.removeDestinationField(i)}
								value="X"
								className="ui button"
							/>
							<Form.Group key={`destination ${i + 1}`}>
								<Form.Input
									name="name"
									value={d.name}
									placeholder={`Destination ${i + 1}`}
									onChange={this.handleDestinationChange(i)}
									width={8}
								/>
								<Form.Input
									name="description"
									value={d.description}
									placeholder="Description"
									onChange={this.handleDestinationChange(i)}
									width={8}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Input
									type="date"
									name="arrival"
									value={this.state.destinations[i].arrival}
									selected={this.state.startDate}
									onChange={this.handleDestinationChange(i)}
									width={8}
								/>
								<Form.Input
									type="date"
									name="departure"
									value={this.state.destinations[i].departure}
									selected={this.state.endDate}
									onChange={this.handleDestinationChange(i)}
									width={8}
								/>
							</Form.Group>
						</div>
					))}
					<a
						className="float-right-btn"
						role="button"
						onClick={this.addDestinationField}
						style={{ cursor: 'pointer' }}>
						Add another Destination
					</a>
					<Button primary type="submit">
						Update
					</Button>
				</Form>
				<a
					role="button"
					onClick={this.props.toggleEdit}
					style={{ cursor: 'pointer' }}>
					Back
				</a>
			</div>
		);
	}
}

export default connect(null, { editTrip })(EditTripForm);
