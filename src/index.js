// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import * as firebase from 'firebase';
import firebase_config from './firebase-config.js';
import './index.css';
import Calendar from './Calendar';
import App from './App';

firebase.initializeApp(firebase_config);
const database = firebase.database();

function getValues(snap) {
	const values = snap.val();
	var fbValues = []
	if(values !== null && values !== undefined) {
		var sortable = [];
		for(var v in values) {
			sortable.push([v, values[v]])
		}
		sortable.sort(function(a, b) {
			return b[1] - a[1];
		})
		for (var i = 0; i < sortable.length; i ++)
			fbValues.push(sortable[i][0]);
	}
	return fbValues;
		
}

function getCategories(callback) {
	database.ref('/categories').once('value', snap => {
		var fbCategories = getValues(snap);
		callback(fbCategories);
	});
}

function getTasks(filter, callback) {
	var dbRef = database.ref('/tasks');
	if(filter !== "all") {
		dbRef = dbRef.orderByChild("category").equalTo(filter);
	}
	dbRef.once('value', snap => {
		var fbTasks = getValues(snap);
		callback(fbTasks);
	});
}

function ListItem(props) {
	var removeStyle = {
		paddingLeft: '80px',
		color:'red'
	}
	return (
		<li>
			<Link to={props.url + props.value}>{props.value}</Link>
			<span className="remove" style={removeStyle} onClick={() => props.remove(props.value)}>X</span>
		</li>
	)
}

class Categories extends React.Component {
	constructor() {
		super();
		this.state = {
			categories: []
		}
	}

	fillCategories() {
		getCategories((fbCategories) => {
			this.setState({categories: fbCategories});
			document.getElementById('addCategoryInput').focus();
		});
	}

	removeCategory(category) {
		database.ref('/categories/' + category).remove().catch((error) => {
			console.log("There was an error while deleting category '" + category + "': " + error);
		});
	}

	watchCategory() {
		database.ref('/categories').on('child_removed', (snap) => {
			this.fillCategories();
		});
		database.ref('/categories').on('child_added', (snap) => {
			this.fillCategories();
		})
	}

	componentDidMount() {
		this.fillCategories();
		this.watchCategory();
	}

	addCategory() {
		var category = document.getElementById('addCategoryInput').value;
		var priority = document.getElementById('addPriorityInput').value;
		if(category === "" || priority === "")
			return;
		var category_item = {}
		category_item[category] = priority
		database.ref('/categories').update(category_item).then(() => {
			document.getElementById('addCategoryInput').value = "";
			document.getElementById('addPriorityInput').value = "";
		}).catch((error) => {
			console.log("There was an error while updating categories in Firebase: " + error);
		});
	}

	_handleKeyPress(e) {
		if(e.key === 'Enter') {
			this.addCategory();
		}
	}

	render() {
		var categoryTags = [];
		this.state.categories.forEach((item, i) => {
			categoryTags.push(<ListItem key={i} value={item} url="/tasks/" remove={this.removeCategory}></ListItem>)
		});
		return (
			<div className="categoryList">
				<h3>Current Categories</h3>
				<ul>
					{categoryTags}
				</ul>
				<input type="text" id="addCategoryInput" placeholder="Add Category" />
				<input type="text" id="addPriorityInput" placeholder="Priority" onKeyPress={(e) => this._handleKeyPress(e)}/>
				<button type="button" onClick={() => this.addCategory()}>Add</button>
			</div>
		);
	}
}

class AddTask extends React.Component {
	constructor() {
		super();
		this.state = {
			categories: []
		}
	}

	fillCategories() {
		getCategories((fbCategories) => {
			this.setState({categories: fbCategories});
		});
	}

	watchCategory() {
		database.ref('/categories').on('child_removed', (snap) => {
			this.fillCategories();
		});
		database.ref('/categories').on('child_added', (snap) => {
			this.fillCategories();
		})
	}

	componentDidMount() {
		this.fillCategories();
		this.watchCategory();
	}

	addTask() {
		var task = document.getElementById('addTaskInput').value;
		var category = document.getElementById('categoryDropdown').value;
		var desc = document.getElementById('taskDescription').value.split(';');
		if(task === "" || category === "")
			return;
		var task_item = {}
		task_item[task] = {
			"category": category,
			"description": desc,

		}
		database.ref('/tasks').update(task_item).then(() => {
			document.getElementById('addTaskInput').value = "";
			document.getElementById('taskDescription').value = "";
			document.getElementById('addTaskInput').focus();
		}).catch((error) => {
			console.log("There was an error while updating tasks in Firebase: " + error);
		});
	}

	_handleKeyPress(e) {
		if(e.key === 'Enter') {
			this.addTask();
		}
	}

	render() {
		var categoryTags = [];
		this.state.categories.forEach((item, i) => {
			categoryTags.push(<option key={i} value={item}>{item}</option>)
		});
		return (
			<div className="categorySelect">
				<div>
					<input type="text" id="addTaskInput" placeholder="Add Task" />
				</div>
				<div>
					<select id="categoryDropdown">
						{categoryTags}
					</select>
				</div>
				<div>
					<textarea id="taskDescription" onKeyPress={(e) => this._handleKeyPress(e)}></textarea>
				</div>
				<div>
					<button type="button" onClick={() => this.addTask()}>Add</button>
				</div>
			</div>
		)
	}

}

class Tasks extends React.Component {
	constructor(props) {
		super();
		this.state = {
			tasks: [],
			filter: props.filter
		}
	}

	fillTasks() {
		getTasks(this.state.filter, (fbTasks) => {
			this.setState({tasks: fbTasks});
		});
	}

	watchTasks() {
		database.ref('/tasks').on('child_removed', (snap) => {
			this.fillTasks();
		});
		database.ref('/tasks').on('child_added', (snap) => {
			this.fillTasks();
		})
	}

	componentDidMount() {
		this.fillTasks();
		this.watchTasks();
	}

	removeTask(task) {
		database.ref('/tasks/' + task).remove().catch((error) => {
			console.log("There was an error while deleting task '" + task + "': " + error);
		});
	}

	render() {
		var taskTags = [];
		this.state.tasks.forEach((item, i) => {
			taskTags.push(<ListItem key={i} value={item} url="/taskDetail/" remove={this.removeTask}></ListItem>)
		});
		return (
			<div className="categoryList">
				<h3>Current Tasks</h3>
				<ul>
					{taskTags}
				</ul>
			</div>
		);
	}
}

// function App(props) {
// 	return (
// 		<div>
// 			<MainRoutes></MainRoutes>
// 		</div>
// 	)
// }

function Header(props) {
	return (
		<header>
			<nav>
				<ul>
					<li>
						<Link to="/tasks/all">Tasks</Link>
					</li>
				</ul>
			</nav>
		</header>
	)
}

function Home(props) {
	return (
		<div>
			<h1>Welcome to Donna</h1>
			<Header></Header>
			<Categories></Categories>
		</div>
	)
}

function TaskHandler(props) {
	return (
		<div>
			<Tasks filter={props.match.params.filter}></Tasks>
			<AddTask></AddTask>
		</div>
	)
}

class TaskDetailUpdater extends React.Component {
	constructor() {
		super();
		this.state = {
			categories: []
		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		getCategories((fbCategories) => {
			this.setState({
				categories: fbCategories,
			})
		});
	}

	handleChange(event) {
		console.log(event);
		this.setState({desc: event.target.value});
	}

	updateTask() {
		var task = this.props.task;
		var category = document.getElementById('categoryDropdownTaskUpdate').value;
		var desc = document.getElementById('taskDescriptionTaskUpdate').value.split(';');
		this.setState({desc: desc})
		if(task === "" || category === "")
			return;
		var task_item = {}
		task_item[task] = {
			"category": category,
			"description": desc
		}
		database.ref('/tasks').update(task_item).then(() => {
			
		}).catch((error) => {
			console.log("There was an error while updating tasks in Firebase: " + error);
		});
	}

	_handleKeyPress(e) {
		if(e.key === 'Enter') {
			this.updateTask();
		}
	}

	render() {
		var categoryTags = [];
		this.state.categories.forEach((item, i) => {
			if (item === this.props.category)
				categoryTags.push(<option key={i} value={item} selected>{item}</option>)
			else
				categoryTags.push(<option key={i} value={item}>{item}</option>)
		});
		//TODO: Fix textarea
		var desc = this.props.desc.join(';').slice(0);
		return (
			<div className="updateTaskDetails">
				<h2>Update Task</h2>
				<div>
					<select id="categoryDropdownTaskUpdate" defaultValue={this.state.category}>
						{categoryTags}
					</select>
				</div>
				<div>
					<textarea id="taskDescriptionTaskUpdate"
						 value={desc}
						 onKeyPress={(e) => this._handleKeyPress(e)}></textarea>
				</div>
				<div>
					<button type="button" onClick={() => this.updateTask()}>Update</button>
				</div>
			</div>
		);
	}
}

class TaskDetailHandler extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			task: props.match.params.task,
			category: "",
			desc: []
		}
	}

	componentDidMount() {
		database.ref('tasks/' + this.state.task + '/').once('value', snap => {
			var values = snap.val();
			this.setState({
				category: values['category'],
				desc: values['description']
			});
		});
	}

	render() {
		var descTags = [];
		this.state.desc.forEach((item, i) => {
			descTags.push(<div key={i}>{item}</div>);
		});
		return (
			<div>
				<h1>{this.state.task}</h1>
				<div>Category: {this.state.category}</div>
				<h4>Details:</h4>
				<div>{descTags}</div>
				<TaskDetailUpdater 
					category={this.state.category}
					desc={this.state.desc}
					task={this.state.task}>
				</TaskDetailUpdater>
			</div>
		);
	}
}

function MainRoutes(props) {
	return (
		<main>
			<Switch>
				<Route exact path="/" component={Home}/>
				<Route path="/tasks/:filter" component={TaskHandler}/>
				<Route path="/taskDetail/:task" component={TaskDetailHandler}/>
			</Switch>
		</main>
	)
}


ReactDOM.render(
  <BrowserRouter>
  	<App />
  </BrowserRouter>,
  document.getElementById('root')
);
