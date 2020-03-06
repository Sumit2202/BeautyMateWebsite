import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Button, Grid, Chip } from '@material-ui/core';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import config from '../../config';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';

const BACKEND_URL = config.backend.host;
 
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width:'250px'
  },
  dense: {
    marginTop: 16,
  },
  chip: {
    margin: theme.spacing(),
  },
  formControl: {
    margin: theme.spacing(),
    minWidth: 120,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing()
  },
  leftIcon: {
    marginRight: theme.spacing(),
    fontSize: 20,
  },
  image_viewer: {
    display: 'inline-block',
    width: '200px',
    height: '200px',
    overflow: 'hidden',
    textAlign: 'center',
    marginTop: '2%',
    borderColor: '#BCBCBC',
    border: 'solid 2px',
    borderRadius: 4,
    marginRight: 10,
    marginLeft: 10
  },
});

class ProductAdd extends Component {
  
  fileURL = [];
  fileArray = [];

  state = {
    id: "",
    name: "",
    price: '',
    description: "",
    image: "",
    labelWidth: 0, //used to fix select's border 
    isEdit: false,
    file: [],
  }
  
  constructor(props) {
    super(props);
    this.btnSaveOnClick = this.btnSaveOnClick.bind(this);
    this.btnCancelOnClick = this.btnCancelOnClick.bind(this);
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
    this.handleDrop = this.handleDrop.bind(this);
    if(this.props.location.edit){
      axios.get(BACKEND_URL + `/Product/GetProduct/${this.props.location.productid}`)
      .then(response => {
        this.loadData(response.data)
      })
      .catch(err => alert(err));
    }
  }

  loadData(product){
    this.setState({
      id: product.id,
      name: product.name,
      proce: product.price,
      description: product.description,
      isEdit: true
    });
  }

  btnSaveOnClick(e){
    e.preventDefault();
    const {file} = this.state
    const uploaders = file.map(file => {
      if(file instanceof File){
        const formData = new FormData();
        formData.append('image', file, file.name);
        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
        return axios.post(BACKEND_URL + '/upload', formData).then(response => {
          this.fileURL.push(response.data.fileUrl)
        }).catch( err => {
          // console.log(err);
          // console.log(err.response);
        })
      } else {
        this.fileURL.push(file)
      }
    });
    axios.all(uploaders).then((response) => {
      if (this.state.isEdit){
        const obj = {
          _id: this.state.id,
          name: this.state.name,
          price: this.state.price,
          description: this.state.description,
        };
        axios.put(BACKEND_URL + `/Product/UpdateProduct/${this.state.id}`, obj)
        .then(res => this.saveSuccess(res))
        .catch(function (error) {
          alert(error);
        })
      } else {
        const obj = {
          name: this.state.name,
          price: this.state.price,
          description: this.state.description,
        };
        axios.post(BACKEND_URL + `/Product/CreateProduct`, obj)
        .then(res => this.saveSuccess(res))
        .catch(function (error) {
          alert(error);
        })
      }
    });
  };
  
  saveSuccess(response){
    //TODO: Set a snack bar with Redux to show messages after saving
    this.props.history.goBack();
    alert("Saved");
  }

  uploadMultipleFiles(e) {
    let that = this
    const {target} = e;
    const {files} = target;
    // console.log(files.length)
    // console.log(that.state.file.length)
    if (files && files[0]) {
      const length_images = that.state.file.length + files.length
      if(length_images <= 2){
        for(var i = 0; i< files.length; i++)
        {
          that.setState({loadingImage : true})
          e.preventDefault();

          let reader = new FileReader();
          let file = e.target.files[i];
      
          reader.onload = event => {
            that.fileArray.push(event.target.result);
            that.setState({file: [...that.state.file, file]});
          };
      
          reader.readAsDataURL(file)
          that.setState({loadingImage : false})
        }
      } else {
        alert('You can only upload 2 images at this time')
      }
    }
  }

  handleDrop = files => {
    // console.log(files.length)
    let that = this
    if (!files) { return; }
    if(that.state.file.length < 2) {
      // console.log(that.state.file.length)
      // console.log(files.length)
      const length_images = that.state.file.length + files.length
      if(length_images <= 2){
        that.setState({loadingImage : true})
        files.map(file => {
          // console.log(file)
          // let reader = new FileReader();
          this.fileArray.push(URL.createObjectURL(file))
          // console.log(this.state.file)
          that.setState({file : [...that.state.file, file], loadingImage: false})
        })
      } else {
        alert('You can only upload 2 images at this time')
      }
    } else {
      alert('You can only upload 2 images at this time')
    }
  }

  removePhoto(index){
    let that = this
    that.fileArray.splice(index, 1);
    that.setState({ file: that.fileArray });
    // console.log(that.fileArray)
    // console.log(that.state.file)
  }
  
  btnCancelOnClick(e){
    e.preventDefault();
    this.props.history.goBack();
  }
  
  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  cbSetImageNewLink(link){
    this.setState({ image: link });
  }

  render() {

    const { classes } = this.props;
    return (
      <div>
      <Typography variant="h4" gutterBottom>
        {this.state.isEdit ? 'Edit Product' : 'Add Product'}
      </Typography>
        <Grid container>
          <form className={classes.container} autoComplete="off">
            <Grid item xs={12}>
              <TextField id="tfName" label="Name"
                margin="normal" variant="outlined" required
                style={{width:'98%', marginLeft:10}}
                value={this.state.name}
                onChange={this.handleChange('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField id="tfPrice" label="Price"
                margin="normal" variant="outlined" required
                style={{width:'98%', marginLeft:10}}
                value={this.state.price}
                onChange={this.handleChange('price')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-multiline-static"
                label="Description" multiline rows="4" value={this.state.description}
                className={classes.textField} margin="normal" variant="outlined"
                style={{width:'98%', marginLeft:10}} onChange={this.handleChange('description')}
              />
            </Grid>
            <Grid container spacing={24} direction="row" justify="center" alignItems="center">
              {(this.fileArray || []).map((url, index) => (
                <Grid className={classes.image_viewer}>
                  <IconButton component="label" style={{ color: '#F6227F', marginBottom: -20, marginLeft: 150}} aria-label="delete" onClick={() => this.removePhoto(index)}>
                    <CancelIcon style={{fontSize: '24px'}}/>
                  </IconButton>
                  { this.state.loadingImage ? <CircularProgress /> : <img alt='...' src={url ? url : 'https://www.motorolasolutions.com/content/dam/msi/images/products/accessories/image_not_available_lg.jpg'} style={{height: '200px', width: '200px', marginTop: -27}}/>}
                </Grid> ))}
            </Grid>
            
            <Grid container spacing={24} direction="row" justify="center" alignItems="center" style={{minWidth: '80%'}}>
                <Grid item xs={8} justify="center" align="center" style={{border: 'dashed 2px #979A9B', borderRadius: 8, marginTop: 18, minHeight: '20vh'}}>


                    
                </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Button variant="contained" size="medium" className={classes.button} 
              name="btnSave" onClick={this.btnSaveOnClick}>
                <SaveIcon className={classes.leftIcon}/>
                Save
              </Button>
              <Button variant="contained" size="medium" className={classes.button} onClick={this.btnCancelOnClick}>
                <CancelIcon className={classes.leftIcon}/>
                Cancel
              </Button>
            </Grid>
          </form>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ProductAdd);