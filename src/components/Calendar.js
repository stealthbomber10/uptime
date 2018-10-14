import React from "react";
import dateFns from "date-fns";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import {Popover, ButtonToolbar, OverlayTrigger, Button, Modal, MenuItem} from "react-bootstrap";
import {db, auth} from '../base';

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
	db.ref('/categories').once('value', snap => {
		var fbCategories = getValues(snap);
		callback(fbCategories);
	});
}

function getTasks(filter, callback) {
	var dbRef = db.ref('/tasks');
	if(filter !== "all") {
		dbRef = dbRef.orderByChild("category").equalTo(filter);
	}
	dbRef.once('value', snap => {
		var fbTasks = getValues(snap);
		callback(fbTasks);
	});
}

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    events: {},
    eventDetailsShow: false,
    category: {value: 'homework', label: 'Homework'},
    start: '12AM',
    end: '12AM'
  };

  constructor(props) {
    super(props);
    this.saveEvent = this.saveEvent.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getTasks = this.getTasks.bind(this);
  }

  pushTask(title, category, time_start, time_end, day) {
    var uid = auth.currentUser.uid;
    var formattedDate = dateFns.format(day, 'YYYY-MM-DD')
    var dbRef = db.ref('/tasks/' + uid + '/' + formattedDate);
    var task_item = {
      'title': title,
      'category': category,
      'time_start': time_start,
      'time_end': time_end
    }
    dbRef.push(task_item).then(() => {
      document.getElementById('event_title').value = "";
    }).catch((error) => {
      console.log("There was an error while updating tasks in Firebase: " + error);
    });
  }

  getTasks() {
    var dbRef = db.ref('/tasks/' + auth.currentUser.uid);
    dbRef.once('value', snap => {
      var value_items = snap.val();
      var temp_events = {}
      if(value_items !== null && value_items !== undefined) {
        for (var key in value_items) {
            if (value_items.hasOwnProperty(key)) {
                var date_text = key;
                var date = dateFns.parse(date_text);
                var task_obj = value_items[key]
                for (var task_key in task_obj) {
                  if (task_obj.hasOwnProperty(task_key)) {
                    var task = task_obj[task_key];
                    if (task !== undefined) {
                      var category = task['category'];
                      var start_time = task['time_end'];
                      var end_time = task['time_start'];
                      var title = task['title'];
                      if(temp_events[date] == null)
                        temp_events[date] = []
                      temp_events[date].push({
                        'time_start': start_time,
                        'time_end': end_time,
                        'event_category': category,
                        'event_title': title
                      });
                    }
                  }
                }
            }
        }
        this.setState({
          events: temp_events,
        });
      }
    });
  }

  componentDidMount() {
    this.getTasks();
  }

  handleClose() {
    this.setState({ eventDetailsShow: false });
  }

  handleShow(item) {
    this.setState({ 
        eventDetailsShow: true,
        event_title: item.event_title,
        time_start: item.time_start,
        time_end: item.time_end 
    });
  }


//   events: {
//       "2018-08-02": [
//           {
//               time_start: "4pm",
//               time_end: "",
//               event_category: "",
//               event_title: ""
//           }
//       ]
//   }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  saveEvent(event) {
    //   event.preventDefault();
      let temp_events = this.state.events;
      if(temp_events[this.state.selectedDate] == null)
        temp_events[this.state.selectedDate] = []
      var title = document.getElementById('event_title').value;
      var category = this.state.category;
      var start = this.state.start;
      var end = this.state.end;
      temp_events[this.state.selectedDate].push({
          event_title: title,
          event_category: category.value,
          time_start: start.value,
          time_end: end.value,
        });
      this.setState({
          events: temp_events,
          category: {label: "Homework", value: "homework"},
          start: "12AM",
          end: "12AM"
      })
      console.log(start)
      this.pushTask(title, category, start.value, end.value, this.state.selectedDate);
      return false;
  }

  handleCategoryChange = (selectedOption) => {
    this.setState({ 
      category: selectedOption
    });
  }

  handleStartChange = (selectedOption) => {
    this.setState({ 
      start: selectedOption 
    });
  }

  handleEndChange = (selectedOption) => {
    fetch("http://104.196.67.238/getActualTime?title=" + document.getElementById('event_title').value + "&category=" + this.state.category.value)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    this.setState({ 
      end: selectedOption 
    });
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const category_options = [
      {
        "value": "homework",
        "label": "Homework"
      },
      {
        "value": "selfdev",
        "label": "Self-Help"
      },
      {
        "value": "chore",
        "label": "Chore"
      }
    ]

    const start_time_options = ["12AM"]
    for (var i = 1; i < 12; i ++)
      start_time_options.push(i + "AM");
    start_time_options.push("12PM");
    for (var i = 1; i < 12; i ++)
      start_time_options.push(i + "PM");

    const end_time_options = ["12AM"]
    for (var i = 1; i < 12; i ++)
      end_time_options.push(i + "AM");
    end_time_options.push("12PM");
    for (var i = 1; i < 12; i ++)
      end_time_options.push(i + "PM");


    const popoverBottom = (
        <Popover id="popover-positioned-bottom" title="Add Task">
              <label>
                 <strong>Task name: </strong> 
                 <input type="text" name="event_title" id="event_title"/>
              </label>
                 <Dropdown id="event_category" id="event_category" options={category_options} value={this.state.category} placeholder="Select a category" onChange={this.handleCategoryChange}/>
                 <br></br>
                 <br></br>
                 <Dropdown id="start_time" id="start_time" options={start_time_options} value={this.state.start} placeholder="Select a category" onChange={this.handleStartChange}/>
                 <Dropdown id="end_time" id="end_time" options={end_time_options} value={this.state.end} placeholder="Select a category" onChange={this.handleEndChange}/>
                  
                 <button onClick={this.saveEvent}>Save</button>
        </Popover>
    );

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    const styles= {
        background: "#05c2e6",
        width:"190px",
        borderRadius: "15px",
        display:"flex",
        textAlign:"center",
        zIndex: "10000"
    }
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        let events_html = []
        if (this.state.events[day] != null) {
            this.state.events[day].forEach((item, i) => {

                events_html.push(
                    <div id="test"
                        className="event_list_item"
                        key={i}
                        style={styles}
                        onClick={() => this.handleShow(item)}
                    >
                        {item.event_title}
                        
                    </div>
                );
                
            });
        }
        
        days.push(
            <OverlayTrigger key={i} trigger="click" placement="bottom" overlay={popoverBottom}>
    
                <div
                    className={`col cell ${
                    !dateFns.isSameMonth(day, monthStart)
                        ? "disabled"
                        : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                    }`}
                    key={day}
                    onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
                >
                    <span className="events">
                            {events_html}
                    </span>
                    <span className="number">{formattedDate}</span>
                    
                </div>
            </OverlayTrigger>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return (<div className="body">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
        {rows}
        <Modal show={this.state.eventDetailsShow} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.event_title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Start Time: {this.state.time_start}<br/>
            End Time: {this.state.time_end}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>

</div>);
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

export default Calendar;