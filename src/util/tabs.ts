export type DataType = {
	title: string,
	url: string,
	icon?: string,
	time?: number;
};

class Tabs {
	fetch(): Promise<DataType[]> {
		return new Promise(res => {
			chrome.tabs.query({ currentWindow: true }, lists => {
				const data: DataType[] = [];

				lists.forEach(item => {
					if (!item.url || !item.title) {
						return;
					}

					data.push({
						title: item.title,
						url: item.url,
						icon: item.favIconUrl,
					});
				});

				res(data);
			});
		});
	}

	open(url: string): Promise<chrome.tabs.Tab> {
		return new Promise(res => {
			chrome.tabs.create({ url, active: false }, res);
		});
	}
}

export const tabs = new Tabs();
