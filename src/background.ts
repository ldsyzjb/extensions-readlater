import { storage,  EventType } from './util';
import lodash from 'lodash';

const DATA_KEY = 'th';
const TIME_KEY = 'time';

let GlobalData = {};
let GlobalTime = 0;

// Init
storage
	.get(DATA_KEY)
	.then(data => {
		try {
			GlobalData = JSON.parse(data[DATA_KEY]);
		} catch (e) {
			GlobalData = {};
		}
	})
	.then(() => {
		chrome.runtime.onMessage.addListener((event: EventType) => {
			console.log('listend event', event);
			
			if (event.name === 'sync') {
				if (event.data) {
					GlobalTime = event.time;
					GlobalData = event.data;

					storage.set({
						[TIME_KEY]: GlobalTime,
						[DATA_KEY]: JSON.stringify(event.data),
					});
				} else {
					chrome.runtime.sendMessage({
						name: 'sync:back',
						time: GlobalTime,
						data: GlobalData,
					});
				}
			}
		});
	});
