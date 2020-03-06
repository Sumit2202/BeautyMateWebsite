import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ArchiveIcon from '@material-ui/icons/Archive';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import config from '../../config';
import LinearProgress from '@material-ui/core/LinearProgress';
// import ImgNotFound from '../../assets/img/logo-black-img-not-found.png';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Grid } from '@material-ui/core';

const BACKEND_URL = config.backend.host;

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: '50%',
    backgroundColor: '#FAFAFA'
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  imgSize: {
    width: "50px",
  },
  fab: {
    margin: theme.spacing(3),
    height: '10%',
    width: '3%',
    color: 'white',
    backgroundColor: '#F6227F',
    '&:hover': {
      color: 'white !important',
      backgroundColor: '#c41b63 !important' 
    },
    borderRadius: 5
  },
  button: {
    margin:10
  },
  extendedIcon: {
    marginRight: theme.spacing(),
  },
  select: {
    width: "200px",
  },
});

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#ededed',
    color: 'black',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class ProductList extends Component {
  _isMounted = false;

  state = {
    products: [],
    checkedA: true,
    checkedB: true,
    name: [],
    loading: true,
    openDeleteDialog: false,
  }

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  handleChangeMultiple = event => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
  };
  
  componentDidMount(){
    this._isMounted = true;
    console.log("componentDidMount");
    this.listProducts();
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  listProducts(){
    axios.get(BACKEND_URL + `/Product/GetProducts`)
      .then(response => {
        console.log(response)
        if (this._isMounted){
          this.setState({ 
            products: response.data ,
            loading: false,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        //TODO: Show errors with snackbars
      })
  }
  
  getStyles(name, that) {
    return {
      fontWeight:
        that.state.name.indexOf(name) === -1
          ? that.props.theme.typography.fontWeightRegular
          : that.props.theme.typography.fontWeightMedium,
    };
  }
  
  btnDeleteOnClick(id, e){
    this.setState({ 
      deleteId: id,
      openDeleteDialog: true
    });
  }

  proceedDelete(){
    axios.delete(BACKEND_URL + `/Product/DeleteProduct/${this.state.deleteId}`)
    .then(this.updateStateAfterDelete(this.state.deleteId))
    .catch(function (error) {
      console.log(error);
      //TODO: Show errors with snackbars
    });
   this.setState({ 
      deleteId: '',
      openDeleteDialog: false
    });
  }

  updateStateAfterDelete(id){
    console.log('Deleted!');
    this.setState({
      products: this.state.products.filter(b => b._id !== id)
    })
  }

  cancelDelete(){
    this.setState({ 
      deleteId: '',
      openDeleteDialog: false
    });
  }

  render(){
    
    const { classes } = this.props;

    return(
      <div>
        <Grid align = "center" justify="space-evenly" container alignItems = "center">
          <Grid xs={8}>
            <Typography variant="h4">
              Products
            </Typography>
          </Grid>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.products.map(product => (
              <TableRow className={classes.row} key={product.id}>
                <CustomTableCell align="left"><img alt='' className={classes.imgSize} src={product.picture?product.picture: 'https://www.motorolasolutions.com/content/dam/msi/images/products/accessories/image_not_available_lg.jpg'}/></CustomTableCell>
                <CustomTableCell align="left">{product.name}</CustomTableCell>
                <CustomTableCell align="left">{product.price}</CustomTableCell>
                <CustomTableCell align="left">{product.description}</CustomTableCell>
                <CustomTableCell align="left">
                  <Tooltip title="Edit User" aria-label="Edit">
                    <IconButton aria-label="Edit" className={classes.margin} component={Link} to={`/product/edit/${product.id}`}>
                      <EditIcon fontSize="small" style={{color: '#F6277F'}}/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User" aria-label="Delete">
                    <IconButton aria-label="Delete" className={classes.margin} onClick={this.btnDeleteOnClick.bind(this, product.id)}>
                      <DeleteIcon fontSize="small" style={{color: '#F6277F'}}/>
                    </IconButton>
                  </Tooltip>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {this.state.loading ? <LinearProgress /> : ""}
        <Dialog
          open={this.state.openDeleteDialog}
          onClose={this.cancelDelete.bind(this)}
          disableBackdropClick
          disableEscapeKeyDown
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete.bind(this)} color="primary">
              No
            </Button>
            <Button onClick={this.proceedDelete.bind(this)} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ProductList);