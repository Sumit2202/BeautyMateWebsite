import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withStyles } from '@material-ui/core';
import { Switch, Route, Router } from 'react-router-dom';
import MainPage from './components/MainPage';
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


  componentDidMount(){
    document.title="BeautyMate"
  }

  render(){
    const {classes} = this.props

    return (
      <div className={classes.root}>
        <Router history={history}>
          <Switch>
            <Route path='/' component={ MainPage } isPrivate/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default  withStyles(styles)(App);
