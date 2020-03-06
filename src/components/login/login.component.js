import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'
import axios from 'axios'
import config from '../../config'

const BACKEND_URL = config.backend.host;

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit
    }
});

class Login extends React.Component {

    state = {
        username: "",
        password:""
    }

    btnSignInOnClick(){
        const obj = {
            EmailOrUsername: this.state.username,
            Password: this.state.password,
        }
        axios.post(BACKEND_URL + `/Account/Login`, obj)
        .then(response => {
            console.log(response)
            this.loginSuccess(response.data)
        })
        .catch(err => {
            console.log(err.response)
            this.loginError(err)
        });
    }

    handleChange = field => event => {
        this.setState({ [field]: event.target.value });
    };

    loginSuccess(data){
        axios.defaults.headers.common['Authorization'] = data.token;
        this.props.cbLoginSuccess(false);
    }

    loginError(err){
        let msg = ''; 
        if (err.response){
          msg = ' \nServer Message: ' + err.response.data.message
        }
        alert(err + msg);
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="email"
                                value={this.state.username}
                                onChange={this.handleChange('username')} 
                                fullWidth autoFocus required />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="Password" label="Password" type="password"
                                value={this.state.password}
                                onChange={this.handleChange('password')} 
                                fullWidth required />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button variant="outlined" color="primary"
                            style={{ textTransform: "none" }}
                            onClick={() => this.btnSignInOnClick()}>
                            Login
                        </Button>
                    </Grid>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(Login);