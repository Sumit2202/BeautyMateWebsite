import React from 'react';
import '../App.css';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import UserList from './user/user.list.component';
import UserEdit from './user/user.edit.component';
import ProductList from './product/product.list.component';
import ProductAdd from './product/product.add.component';
// import AppBar from './components/common_components/app_bar.component'
import axios from 'axios';
import { render } from '@testing-library/react';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  selected: {
    "&$selected": {
      backgroundColor: "#000",
      color: 'white'
    },
    '&:hover': {
      color: 'white !important',
      backgroundColor: 'grey !important' 
    }
  }
});

class MainPage extends React.Component {

    state={
        open: true,
        selectedIndex: 0
    }

    componentDidMount(){
        document.title="BeautyMate"
        if(!axios.defaults.headers.common['Authorization']){
            this.props.history.push("/") 
        }
    }
    
    handleClick = () => {
        this.setState({ open: !this.state.open})
    };
    
    handleListItemClick = (index) => {
        this.setState({selectedIndex: index})
    };

    render(){
        const { classes } = this.props;
        return (
            <Router>
              {/* <AppBar/> */}
              <Grid container spacing={12} style={{marginTop: '5%'}} >
                  <Grid item xs={3} style={{paddingLeft:'2%', marginRight: '-2%'}}>
                      <Paper style={{width: '80%'}}>
                      <List
                          component="nav"
                          className={classes.root}>
      
                          <ListItem button component={Link} to="/user" 
                          selected={this.state.selectedIndex === 0}
                          classes={{selected: classes.selected}}
                          onClick={() => this.handleListItemClick(0)}
                          >
                          <ListItemText primary="User" />
                          </ListItem>
      
                          <ListItem button component={Link} to="/product" 
                          selected={this.state.selectedIndex === 1}
                          classes={{ selected: classes.selected }}
                          onClick={() => this.handleListItemClick(1)}
                          >
                          <ListItemText primary="Product" />
                          </ListItem>
      
                          <ListItem button 
                          selected={this.state.selectedIndex === 7}
                          classes={{ selected: classes.selected }}
                          onClick={() => this.handleListItemClick(2)}
                          >
                          <ListItemText primary="LogOut" />
                          </ListItem>
                      </List>
                      </Paper>
                  </Grid>
                  <Grid item xs={9} style={{paddingRight:30}}>
                      <Paper>
                          <Switch>
                              <Route exact path='/' component={ UserList }/>
                              <Route exact path='/user' component={ UserList } />
                              <Route exact path='/user/edit/:id' component={ UserEdit } />
                              <Route exact path='/product/' component={ ProductList } />
                              <Route exact path='/product/add/:id' component={ ProductAdd } />
                              <Route exact path='/product/edit/:id' component={ ProductAdd } />
                          </Switch>
                      </Paper>
                  </Grid>
              </Grid>
            </Router>
          );
    }
}

export default withStyles(styles)(MainPage);