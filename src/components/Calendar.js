import React from "react";
import dateFns from "date-fns";
import {Popover, ButtonToolbar, OverlayTrigger, Button, Modal, DropdownButton, MenuItem} from "react-bootstrap";
import db from '../base';

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

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    events: {},
    eventDetailsShow: false
  };

  constructor(props) {
    super(props);
    this.saveEvent = this.saveEvent.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    console.log(this.state.eventDetailsShow);
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
      temp_events[this.state.selectedDate].push({
          event_title: document.getElementById('event_title').value,
          event_category: "",
          time_start: document.getElementById('start_time').value,
          time_end: document.getElementById('end_time').value,
        });
      this.setState({
          events: temp_events,
      })
      return false;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const popoverBottom = (
        <Popover id="popover-positioned-bottom" title="Add Task">
              <label>
                 <strong>Task name: </strong> 
                 <input type="text" name="event_title" id="event_title"/>
              </label>
              <DropdownButton
                  bsStyle="default"
                  bsSize="small"
                  style={{ maxHeight: "28px" }}
                  title={"Category"}
                  key={1}
                  id="event_category"
                >
                  <MenuItem eventKey="1">Homework</MenuItem>
                  <MenuItem eventKey="2">Chores</MenuItem>
                  <MenuItem eventKey="3">Self-Help</MenuItem>
                </DropdownButton>
                 <br></br>
                 <br></br>
                 <DropdownButton
                  bsStyle="default"
                  bsSize="small"
                  style={{ maxHeight: "28px" }}
                  title={"Start Time"}
                  key={2}
                  id="start_time"
                >
                  <MenuItem eventKey="1">12AM</MenuItem>
                  <MenuItem eventKey="2">1AM</MenuItem>
                  <MenuItem eventKey="3">2AM</MenuItem>
                  <MenuItem eventKey="4">3AM</MenuItem>
                  <MenuItem eventKey="5">4AM</MenuItem>
                  <MenuItem eventKey="6">5AM</MenuItem>
                  <MenuItem eventKey="7">6AM</MenuItem>
                  <MenuItem eventKey="8">7AM</MenuItem>
                  <MenuItem eventKey="9">8AM</MenuItem>
                  <MenuItem eventKey="10">9AM</MenuItem>
                  <MenuItem eventKey="11">10AM</MenuItem>
                  <MenuItem eventKey="12">11AM</MenuItem>
                  <MenuItem eventKey="13">12pM</MenuItem>
                  <MenuItem eventKey="14">1PM</MenuItem>
                  <MenuItem eventKey="15">2PM</MenuItem>
                  <MenuItem eventKey="16">3PM</MenuItem>
                  <MenuItem eventKey="17">4PM</MenuItem>
                  <MenuItem eventKey="18">5PM</MenuItem>
                  <MenuItem eventKey="19">6PM</MenuItem>
                  <MenuItem eventKey="20">7PM</MenuItem>
                  <MenuItem eventKey="21">8PM</MenuItem>
                  <MenuItem eventKey="22">9PM</MenuItem>
                  <MenuItem eventKey="23">10PM</MenuItem>
                  <MenuItem eventKey="24">11PM</MenuItem>
                </DropdownButton>
                <DropdownButton
                  bsStyle="default"
                  bsSize="small"
                  style={{ maxHeight: "28px" }}
                  title={"End Time"}
                  key={3}
                  id="end_time"
                >
                  <MenuItem eventKey="1">12AM</MenuItem>
                  <MenuItem eventKey="2">1AM</MenuItem>
                  <MenuItem eventKey="3">2AM</MenuItem>
                  <MenuItem eventKey="4">3AM</MenuItem>
                  <MenuItem eventKey="5">4AM</MenuItem>
                  <MenuItem eventKey="6">5AM</MenuItem>
                  <MenuItem eventKey="7">6AM</MenuItem>
                  <MenuItem eventKey="8">7AM</MenuItem>
                  <MenuItem eventKey="9">8AM</MenuItem>
                  <MenuItem eventKey="10">9AM</MenuItem>
                  <MenuItem eventKey="11">10AM</MenuItem>
                  <MenuItem eventKey="12">11AM</MenuItem>
                  <MenuItem eventKey="13">12pM</MenuItem>
                  <MenuItem eventKey="14">1PM</MenuItem>
                  <MenuItem eventKey="15">2PM</MenuItem>
                  <MenuItem eventKey="16">3PM</MenuItem>
                  <MenuItem eventKey="17">4PM</MenuItem>
                  <MenuItem eventKey="18">5PM</MenuItem>
                  <MenuItem eventKey="19">6PM</MenuItem>
                  <MenuItem eventKey="20">7PM</MenuItem>
                  <MenuItem eventKey="21">8PM</MenuItem>
                  <MenuItem eventKey="22">9PM</MenuItem>
                  <MenuItem eventKey="23">10PM</MenuItem>
                  <MenuItem eventKey="24">11PM</MenuItem>
                </DropdownButton>
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
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous" />
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