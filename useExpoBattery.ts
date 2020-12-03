import * as Battery from 'expo-battery';

import { useEffect, useState } from 'react';

export const useExpoBattery = () => {
	const [batteryLevel, setBatteryLevel] = useState<number>();
	let [_subscription] = useState<Battery.Subscription | null>();

	const _subscribe = async () => {
		// tslint:disable-next-line: no-shadowed-variable
		let batteryLevel: number = await Battery.getBatteryLevelAsync();
		batteryLevel = Math.round((batteryLevel + Number.EPSILON) * 100);
		setBatteryLevel(batteryLevel);

		_subscription =
			// tslint:disable-next-line: max-line-length
			Battery.addBatteryLevelListener((batteryState: Battery.BatteryLevelEvent) => {
				setBatteryLevel(Math.round((batteryState.batteryLevel + Number.EPSILON) * 100));
			});
	};

	const _unsubscribe = () => {
		// tslint:disable-next-line: no-unused-expression
		_subscription && _subscription.remove();
		_subscription = null;
	};

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			_subscribe();
		} else {
			_unsubscribe();
		}
		return () => {
			isMounted = false;
		};
	}, [batteryLevel]);

	return batteryLevel;
};
