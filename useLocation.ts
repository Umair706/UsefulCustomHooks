import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';

import { useEffect, useState } from 'react';

export const useLocation = () => {
	const [location] = useState(null);

	const startTracking = async () => {
		const permission = await Permissions.askAsync(Permissions.LOCATION);
		if (permission.status === 'granted') {
			// tslint:disable-next-line: no-console
			console.log('Attempting to start tracking.');
			// tslint:disable-next-line: no-console
			console.log(TaskManager.isTaskDefined('test-app-location'));
			Location.startLocationUpdatesAsync('test-app-location', {
				accuracy: Location.Accuracy.Highest,
				activityType: Location.ActivityType.AutomotiveNavigation,
				timeInterval: 10000,
				// tslint:disable-next-line: object-literal-sort-keys
				distanceInterval: 150,
				foregroundService: {
					notificationTitle: 'Test App Tracking',
					// tslint:disable-next-line: object-literal-sort-keys
					notificationBody: 'Currently actively tracking.',
				},
				pausesUpdatesAutomatically: false,
			})
				.then(() => {
					// tslint:disable-next-line: no-console
					console.log('Location tracking - Background task');
				})
				.catch(err => {
					// tslint:disable-next-line: no-console
					console.error('Unable to start tracking');
					// tslint:disable-next-line: no-console
					console.error(err);
				});
		} else {
			// tslint:disable-next-line: no-console
			console.log('Unable to get permission...');
		}
	};

	useEffect(() => {
		startTracking();
	}, []);

	return location;
};

TaskManager.defineTask('test-app-location', ({ data, error }) => {
	// tslint:disable-next-line: no-console
	console.log('Hello - task received execution');
	if (error) {
		// Error occurred - check `error.message` for more details.
		// tslint:disable-next-line: no-console
		console.error('Unalle to start location task.');
		// tslint:disable-next-line: no-console
		console.error(error);
		return;
	}

	if (data) {
		// tslint:disable-next-line: no-console

		console.log(Date.now());
		// tslint:disable-next-line: no-console
		console.log('Location Changed '+data);
	}
});
