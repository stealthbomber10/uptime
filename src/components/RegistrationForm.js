import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import TextField from 'material-ui/core/TextField';
import Button from 'material-ui/core/Button';
import Grid from 'material-ui/core/Grid';

import { register } from './../helpers/auth';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    textAlign: 'right',
  },
  formGrid: {
    marginRight: 25,
    marginLeft: theme.spacing.unit,
  },
  buttonGrid: {
    marginTop: 30
  }
});	

class RegistrationForm extends Component {
    constructor(props) {
      super(props);
      this.classes = props.classes;
      this.props = props;
    }

    submit() {
      let email = document.getElementById('registerEmail').value;
      let password = document.getElementById('registerPassword').value;
      let name = document.getElementById('registerName').value;
      let number = document.getElementById('registerNumber').value;
      if (name === "" || number === "") {
        alert("Please fill all fields");
        return false;
      }
      register(email, password, name, number).catch(function(e) {
        alert(e);
      });
    }

    render() {
      // console.log(firebase.auth().currentUser);
      return (
        <div>
          <Grid container justify="center">
            <Grid item xs={12} className={this.classes.formGrid}>
              <TextField
                id="registerName"
                label="Full Name"
                className={this.classes.textField}
                type="text"
                fullWidth
                margin="normal"
              />
              <TextField
                id="registerNumber"
                label="Mobile Number"
                className={this.classes.textField}
                type="text"
                fullWidth
                margin="normal"
              />
              <TextField
                id="registerEmail"
                label="Email"
                className={this.classes.textField}
                type="text"
                fullWidth
                margin="normal"
              />
              <TextField
                id="registerPassword"
                label="Password"
                className={this.classes.textField}
                type="password"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid container className={this.classes.buttonGrid}>
              <Grid item xs={12} className={this.classes.button}>
                <Button raised color="primary" onClick={this.submit.bind(this)}>
                  Register
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
}

export default withStyles(styles)(RegistrationForm);
