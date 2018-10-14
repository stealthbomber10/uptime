import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';

import SimpleAppbar from './../components/SimpleAppbar';
import LoginForm from './../components/LoginForm';
import RegistrationForm from './../components/RegistrationForm';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  tabRoot: {
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: 26,
  },
  form: {
    marginTop: 30,
    marginLeft: theme.spacing.unit,
    marginRight: 25
  }
});

const swipe_styles = {
  container: {
    boxShadow: '2px 2px 2px 0px #ccc'
  }
}

function TabContainer({ children, dir }) {
  return (
    <div dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.tabRoot} style={{ width: 500 }}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={swipe_styles.container}
        >
          <TabContainer dir={theme.direction}>
            <Typography type="headline" gutterBottom color="primary">
                Login
            </Typography>
            <Divider/>
            <LoginForm />
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <Typography type="headline" gutterBottom color="primary">
                Register
            </Typography>
            <Divider/>
            <RegistrationForm />
          </TabContainer>          
        </SwipeableViews>
      </div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.theme = props.theme;
  }

  render() {
    return (
      <div className="App">
        <SimpleAppbar />
        <Grid container spacing={24} className={this.classes.root} justify='center'>
          <FullWidthTabs classes={this.classes} theme={this.theme}/>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Login);
