/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { tabs, DataType, EventType } from './util';
import { Button, Checkbox, Icon } from 'antd';
import 'antd/dist/antd.css';
import lodash from 'lodash';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

export interface MainState {
	data: { [key: string]: Required<DataType> };
	time: number;
	selected: CheckboxValueType[];
}

export class Main extends Component<any, MainState> {
	constructor(props: any) {
		super(props);
		this.state = {
			data: {},
			time: 0,
			selected: [],
		};
	}

	componentDidMount() {
		chrome.runtime.sendMessage({ name: 'sync' });
		chrome.runtime.onMessage.addListener((event: EventType) => {
			if (event.name === 'sync:back') {
				this.setState({
					data: event.data,
					time: event.time,
				});
			}
		});
	}

	handleSelected = (selected: CheckboxValueType[]) => {
		this.setState({ selected });
	};

	//Main Operations
	handleUpdate = () => {
		const time = new Date().getTime();
		const { data } = this.state;

		tabs.fetch().then((dataList: DataType[]) => {
			const currentTabs: any = {};			

			dataList.forEach(data => {
				currentTabs[data.url] = Object.assign({ time }, data);
			});

			const newData = Object.assign({}, currentTabs, data);

			try {
				JSON.stringify(newData);
				this.setState({ data: newData, time });
				chrome.runtime.sendMessage({
					name: 'sync',
					data: newData,
					time,
				});
			} catch (e) {
				window.alert('update faild')
			}
		});
	};

	handleClear = () => {
		chrome.runtime.sendMessage({ name: 'sync', data: {}, time: 0 });
		this.setState({data: {}, time: 0})
	};

	handleOpenLatest = () => {
		const { data, time } = this.state;

		console.log('open latest: ', data, time);
		

		for (let key in data) {
			if (data[key].time === time) {
				tabs.open(data[key].url);
				delete data[key];
			}
		}

		this.setState({data})

		chrome.runtime.sendMessage({
			name: 'sync',
			data: data,
		});
	};

	//Batch Operations
	handleBatchDelete = () => {
		const { selected, data } = this.state;

		selected.forEach(url => {
			delete data[url as string];
		})

		this.setState({data, selected: []});

		chrome.runtime.sendMessage({name: 'sync', data})

	}

	handleBatchOpen = () => {
		const {  selected } = this.state;

		selected.forEach(url => {
			tabs.open(url as string);
		})

		this.handleBatchDelete();

	}

	//Single Operations
	handleOpenOne = (item: DataType) => {
		tabs.open(item.url);
	};

	//Render
	renderItem = (item: DataType, index: number) => {
		const { time } = this.state;

		return (
			<div className='tab-item' key={item.url}>
				<Checkbox value={item.url} />
				<span>{index}. </span>
				<span
					className='tab-item-title'
					onClick={() => this.handleOpenOne(item)}>
					{item.title}
				</span>
				{item.time === time && <Icon type='clock-circle' />}
			</div>
		);
	};

	renderBatchButtons = () => {
		const { selected } = this.state;

		if (selected && selected.length > 0) {
			return (
				<div>
					<Button onClick={this.handleBatchDelete}>Delete</Button>
					<Button onClick={this.handleBatchOpen}>Open</Button>
				</div>
			);
		}
	};

	render() {
		const { data } = this.state;
		const list = Object.keys(data);

		list.sort((key1, key2) => {
			return data[key1].time < data[key2].time ? 1 : -1;
		})


		return (
			<div className='popup'>
				<div className='operations'>
					<Button icon='sync' onClick={this.handleUpdate}>
						全部更新
					</Button>
					<Button icon='delete' onClick={this.handleClear}>
						清空
					</Button>
					<Button icon='rise' onClick={this.handleOpenLatest}>
						打开最近
					</Button>
				</div>
				<div className='content'>
					<Checkbox.Group onChange={this.handleSelected}>
						{list.map((item, index) => this.renderItem(data[item], index))}
					</Checkbox.Group>
				</div>
				{this.renderBatchButtons()}
			</div>
		);
	}
}
