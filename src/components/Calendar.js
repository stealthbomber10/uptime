import React from "react";
import dateFns from "date-fns";
import {Popover, ButtonToolbar, OverlayTrigger, Button, Modal} from "react-bootstrap";

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
           
                 <br></br>
                 <strong>Start Time:</strong><input type="text" name="start_time" id="start_time"/><br></br>
                 <strong>End Time:</strong><input type="text" name="end_time" id="end_time"/>
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