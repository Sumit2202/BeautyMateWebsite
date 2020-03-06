import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom"; 
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { AppBar, Toolbar } from '@material-ui/core';

const styles = {
  menu_button: {
    marginRight: -16,
  },
  title: {
    flexGrow: 1,
    color: 'black',
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Open Sans'
  },
  list: {
    width: '80%',
    height: '100%',
    marginLeft: '10%'
  },
  drawerPaper: {
    backgroundColor: 'rgba(52, 52, 52, 0.9)',
    width: '45%',
    background: 'inherit',
    borderRadius: '2px',
    overflow: 'hidden',
    content: '',
  },
  list_title: {
    color: 'white',
    '&:hover': {
      color: '#F6277F',
    },
    fontSize: '3rem',
    '@media (min-width:200px)': {
      fontSize: '1rem',
    },
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    '@media (min-width:960px)': {
      fontSize: '2rem',
    },
    fontWeight: 'bold', 
    fontFamily: 'Open Sans'
  },
  bottom_bar: {
    marginTop: 24,
    backgroundColor: '#FAFAFA',
    borderWidth : 1,
    borderColor: '#EAEAEA',
    borderStyle: 'ridge',
  },
  parent: {
    '&:hover': {
        backgroundColor: '#FFF',
    },
    paddingLeft: '10%'
  }
};

class TopAppBar extends React.Component {

    render(){
      const {classes} = this.props
        return (
          <Grid container style={{paddingBottom: 70}}>
            <AppBar position="fixed" style={{backgroundColor: '#FAFAFA', boxShadow: "none", borderBottom: "0.1px solid #C9C9C9"}}>
            <Toolbar>
              <Grid justify="space-between" container >
                <Grid item >
                  <img alt='' style={{height: 70, boxSizing: 'unset'}} src={'https://i.imgur.com/gi99HGY.png'}/>
                </Grid>
                <Grid item>
                  <Typography variant="h5" style={{
                    flexGrow: 1,
                    color: 'black',
                    marginTop: '12%',
                    fontWeight: 'bold',
                    fontFamily: 'Open Sans'
                  }}>
                    <Link to="/" style={{ color: 'black', fontFamily:'Open Sans', fontWeight: 'bold', textDecoration: 'none'}}>
                      Admin Panel
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Grid>
        );
    }
}

export default withStyles(styles)(TopAppBar);