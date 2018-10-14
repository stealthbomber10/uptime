import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import PropTypes from "prop-types";

import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

// DB
import { login } from './../helpers/auth';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    textAlign: 'right',
  },
  formGrid: {
    marginTop: 30,
    marginRight: 25,
    marginLeft: theme.spacing.unit,
  },
  buttonGrid: {
    marginTop: 40
  },
  forgot: {
    marginLeft: theme.spacing.unit,
  }
});	

class LoginForm extends Component {

    static contextTypes = {
      router: PropTypes.object
    }

    constructor(props, context) {
      super(props, context);
      this.props = props
      this.classes = props.classes;
    }

    submit(context) {
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;
      login(email, password).catch(function(e) {
        alert(e);
      });
    }

    render() {
      //console.log(firebase.auth().currentUser);
      // if (firebase.auth().currentUser) {
      //   return <Redirect to='/'/>
      // } 
      return (
        <div>
          <Grid container justify="center">
            <Grid item xs={12} className={this.classes.formGrid}>
              <TextField
                id="email"
                label="Email"
                className={this.classes.textField}
                type="text"
                fullWidth
                margin="normal"
              />
              <TextField
                id="password"
                label="Password"
                className={this.classes.textField}
                type="password"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid container className={this.classes.buttonGrid}>
              <Grid item xs={5} className={this.classes.forgot}>
                <Typography type="caption" color="primary" gutterBottom>
                  <a href="/forgot">Forgot Password?</a>
                </Typography>
              </Grid>
              <Grid item xs={6} className={this.classes.button}>
                <Button raised color="primary" onClick={() => this.submit(this.context)}>
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
}

export default withStyles(styles)(LoginForm);
