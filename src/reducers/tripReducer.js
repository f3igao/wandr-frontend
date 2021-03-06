const defaultState = {
	userTrips: [],
	targetTrip: {},
	targetDestination: {},
	friendsTrips: []
};

let nextActivities;
let nextDestinations;
let nextDestination;
let nextUserTrips;
let nextTargetTrip;

const tripIndex = state => state.userTrips.indexOf(state.targetTrip);

const destinationIndex = state =>
	state.targetTrip.destinations.indexOf(state.targetDestination);

const activityIndex = (state, activityId) =>
	state.targetDestination.activities.findIndex(
		a => a.id === Number(activityId)
	);

export default function(state = defaultState, action) {
	switch (action.type) {
		case 'FETCH_USERS':
			let friendsTripsRaw = action.payload.friends.map(f => f.trips);
			let friendsTrips = friendsTripsRaw.reduce((acc, f) => acc.concat(f), []);
			return {
				...state,
				friendsTrips
			};
		case 'FETCH_USER_TRIPS':
			return { ...state, userTrips: action.userTrips };
		case 'SET_TARGET_TRIP':
			const targetTrip = state.userTrips.find(
				ut => ut.id === Number(action.id)
			);
			return { ...state, targetTrip };
		case 'SET_FRIEND_TARGET_TRIP':
			const friendTargetTrip = state.friendsTrips.find(
				ft => ft.id === Number(action.id)
			);
			return { ...state, targetTrip: friendTargetTrip };
		case 'ADD_TRIP':
			return { ...state, userTrips: [...state.userTrips, action.newTrip] };
		case 'EDIT_TRIP':
			nextUserTrips = [...state.userTrips];
			nextUserTrips.splice(tripIndex(state), 1, action.editedTrip);
			return {
				...state,
				userTrips: nextUserTrips,
				targetTrip: action.editedTrip
			};
		case 'DELETE_TRIP':
			const postDeleteUserTrips = state.userTrips.filter(
				t => t.id !== Number(action.id)
			);
			return { ...state, userTrips: postDeleteUserTrips, targetTrip: {} };

		case 'SET_TARGET_DESTINATION':
			const targetDestination = state.targetTrip.destinations.find(
				d => d.id === Number(action.id)
			);
			return { ...state, targetDestination };
		case 'CLEAR_TARGET_DESTINATION':
			return { ...state, targetDestination: {} };
		case 'ADD_ACTIVITY':
			nextActivities = [
				...state.targetDestination.activities,
				action.newActivity
			];
			nextDestination = {
				...state.targetDestination,
				activities: nextActivities
			};
			nextDestinations = [...state.targetTrip.destinations];
			nextDestinations.splice(destinationIndex(state), 1, nextDestination);
			nextTargetTrip = { ...state.targetTrip, destinations: nextDestinations };
			nextUserTrips = [...state.userTrips];
			nextUserTrips.splice(tripIndex(state), 1, nextTargetTrip);
			return {
				...state,
				userTrips: nextUserTrips,
				targetTrip: nextTargetTrip,
				targetDestination: nextDestination
			};
		case 'EDIT_ACTIVITY':
			nextActivities = [...state.targetDestination.activities];
			nextActivities.splice(
				activityIndex(state, action.editedActivity.id),
				1,
				action.editedActivity
			);
			nextDestination = {
				...state.targetDestination,
				activities: nextActivities
			};
			nextDestinations = [...state.targetTrip.destinations];
			nextDestinations.splice(destinationIndex(state), 1, nextDestination);
			nextTargetTrip = {
				...state.targetTrip,
				destinations: nextDestinations
			};
			nextUserTrips = [...state.userTrips];
			nextUserTrips.splice(tripIndex(state), 1, nextTargetTrip);
			return {
				...state,
				userTrips: nextUserTrips,
				targetTrip: nextTargetTrip,
				targetDestination: nextDestination
			};
		case 'DELETE_ACTIVITY':
			nextActivities = state.targetDestination.activities.filter(
				a => a.id !== Number(action.payload.id)
			);
			nextDestination = {
				...state.targetDestination,
				activities: nextActivities
			};
			nextDestinations = [...state.targetTrip.destinations];
			nextDestinations.splice(destinationIndex(state), 1, nextDestination);
			nextTargetTrip = {
				...state.targetTrip,
				destinations: nextDestinations
			};
			nextUserTrips = [...state.userTrips];
			nextUserTrips.splice(tripIndex(state), 1, nextTargetTrip);
			return {
				...state,
				userTrips: nextUserTrips,
				targetTrip: nextTargetTrip,
				targetDestination: nextDestination
			};
		default:
			return state;
	}
}
