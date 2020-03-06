import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withStyles } from '@material-ui/core';
import { Switch, Route, Router } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/login/login.component'
import history from './services/history';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

class App extends React.Component{

  state={
    login:true,
  }

  componentDidMount(){
    document.title="BeautyMate"
  }

  cbLoginSuccess(state){
    this.setState({login: state});
  }

  handleChange(field, event) {
    this.setState({ [field]: event.target.value });
  };

  render(){
    const {classes} = this.props

    return (
          this.state.login
            ?
            <LoginPage 
              handleChange={this.handleChange}
              cbLoginSuccess={this.cbLoginSuccess.bind(this)}
            /> :
            <MainPage/>
          
    );
  }
}

export default  withStyles(styles)(App);
