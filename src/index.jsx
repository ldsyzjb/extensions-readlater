/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {  LATEST,  storage, tabs } from './util';
import { Button, Checkbox, Icon} from 'antd';
import 'antd/dist/antd.css';

export class Main extends Component{
    constructor(props){
		super(props);
		this.latest_time  = 0;

        this.state = { lists: [], selected: [] };
    }

    componentDidMount () {
        this.refresh();
	}

	// Batch Operations
	handleChange = (selected) => {
		this.setState({selected})
	}

	handleDelete = () => {
		storage.delete(this.state.selected).then(this.refresh)
	}


	//Main Operations
    handleUpdate = () => {
		const now = new Date().getTime()

        tabs.getAll()
        .then(lists => {
			const all = { [LATEST]: now };

			lists.forEach(item => {
				all[item.title] = {...item, time: now };
			})			

			return storage.save(all)
		})
        .then(this.refresh);
    }

    handleClear = () =>{
		storage.clear().then(this.refresh)
    }

	handleOpenLatest = () => {
		this.state.lists.forEach(tabInfo => {
			if(tabInfo.time === this.latest_time){
				tabs.open(tabInfo.url).then(() => this.handleOpenTab(tabInfo))
			}
		})
	}
	
	handleOpenTab = (tabInfo) => {
		tabs.open(tabInfo.url).then(storage.delete(tabInfo.title)).then(this.refresh)
	}

	renderItem = (item) => {
		return (
			<div className="tab-item">
				<Checkbox value={item.title} />
				<span className="tab-item-title" onClick={() => this.handleOpenTab(item)}>
					{item.title}
				</span>
				{item.time === this.latest_time && <Icon type="clock-circle" />}
			</div>
		)
	}

    render(){   	
        return(
            <div className="popup">
                <div className="operations">
                    <Button icon="sync"  onClick={this.handleUpdate} >全部更新</Button>
                    <Button icon="delete" onClick={this.handleClear}>清空</Button>
                    <Button icon="rise" onClick={this.handleOpenLatest}>打开最近</Button>
                </div>
                <div className="content">
					<Checkbox.Group onChange={this.handleChange}>
						{this.state.lists.map(this.renderItem)}
					</Checkbox.Group>
                </div>
				<div className="batch-operations">
					<Button icon="delete" onClick={this.handleDelete}>删除</Button>
				</div>
            </div>
        );
	}
	
	refresh = () => {
		storage.fetch()
        .then(datas => {
			this.latest_time = datas[LATEST];

			delete datas[LATEST];

			const lists = [];

			for (const key in datas) {
				lists.push(datas[key])
			}

			lists.sort((a, b) => {
				if(a.time && !b.time){
					return -1;
				}else if(!a.time && b.time){
					return 1;
				}else {
					return a.time > b.time ? 1 : -1;
				}
				
			})

			
			this.setState({lists})
		});
	}
}

