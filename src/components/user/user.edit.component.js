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
    _id: "",
    name: "",
    description: "",
    type: "",
    form: "",
    usage_period: "",
    image: "",
    brand: {},
    labelWidth: 0, //used to fix select's border 
    isEdit: false,
    cannabinoid: [],
    terpene: [],
    form_type: [],
    usagePeriodList: [],
    cannabinoidList: [],
    file: [],
    //cannabinoidList: ['THC', 'CBD', 'Other'],
    newCannabinoid: '',
    terpeneList: [],
    //terpeneList: ['Myrcene', 'Limonene', 'Pinene']
    newTerpene: '',
  }
  
  constructor(props) {
    super(props);
    this.btnSaveOnClick = this.btnSaveOnClick.bind(this);
    this.btnCancelOnClick = this.btnCancelOnClick.bind(this);
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
    this.handleDrop = this.handleDrop.bind(this);

    let that = this
    if (props.match.params.brandId){
      axios.get(BACKEND_URL + `/brand/${props.match.params.brandId}`)
          .then(response => that.loadDataBrand(response.data))
          .catch(err => alert(err));
    }
    axios.get(BACKEND_URL + `/configuration`)
    .then(response => this.loadDataConfig(response.data))
    .catch(err => alert(err));
  }

  loadDataConfig(data){
    let that = this
    that.setState({
      form_type: data[0].form_type,
      usagePeriodList: data[0].usage_period,
      cannabinoidList: data[0].cannabinoid,
      terpeneList: data[0].terpene,
    });
  }

  loadDataBrand(pBrand){
    let that = this
    console.log(pBrand)
    if (that.props.match.params.id){
      let product = pBrand.products.filter(b => b._id === that.props.match.params.id)[0];
      that.setState({
        _id: product._id,
        name: product.name,
        description:product.description,
        type: product.type,
        form: product.form,
        usage_period: product.usage_period,
        cannabinoid: 
        product.cannabinoid && product.cannabinoid.length > 0 ? 
          product.cannabinoid : 
          [ {name:'THC', value:''}, {name:'CBD', value:''}, ],
        terpene: product.terpene ? product.terpene : [],
        brand: pBrand,
        isEdit: true,
      });
      if(product.image || product.image2){
        that.fileArray.push(product.image)
        that.setState({file : [product.image]})
        if(product.image2){
          that.fileArray.push(product.image2)
          that.setState({file : [...that.state.file, product.image2]})
        }
      }
    } else {
      that.setState({
        brand: pBrand,
      });
    }
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
          _id: this.state._id,
          name: this.state.name,
          description: this.state.description,
          type: this.state.type,
          form: this.state.form,
          usage_period: this.state.usage_period,
          image: this.fileURL[0] ? this.fileURL[0] : '',
          image2: this.fileURL[1] ? this.fileURL[1] : '',
          cannabinoid: this.state.cannabinoid,
          terpene: this.state.terpene,
        };
        axios.put(BACKEND_URL + `/product/${this.state.brand._id}/${this.state._id}`, obj)
        .then(res => this.saveSuccess(res))
        .catch(function (error) {
          alert(error);
        })
      } else {
        const obj = {
          name: this.state.name,
          description: this.state.description,
          type: this.state.type,
          form: this.state.form,
          usage_period: this.state.usage_period,
          image: this.fileURL[0] ? this.fileURL[0] : '',
          image2: this.fileURL[1] ? this.fileURL[1] : '',
          cannabinoid: this.state.cannabinoid,
          terpene: this.state.terpene,
        };
        axios.post(BACKEND_URL + `/product/${this.state.brand._id}`, obj)
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
  
  addTerpeneChip(e){
    this.setState({
      terpene: [...this.state.terpene.filter(t => t !== this.state.newTerpene), this.state.newTerpene],
      newTerpene: ''
    });
  }
  
  deleteTerpene(terpene, e){
    let newTerpene = this.state.terpene.filter(t => t !== terpene);
    this.setState({
      terpene: newTerpene
    });
  }

  addCannabinoid(e){
    this.setState({
      cannabinoid: [
        ...this.state.cannabinoid.filter(c => c.name !== this.state.newCannabinoid), 
        {name:this.state.newCannabinoid, value:''}
      ] 
    });
  }

  deleteCannabinoid(cannabinoid, e){
    let newCannabinoid = this.state.cannabinoid.filter(c => c.name !== cannabinoid);
    this.setState({
      cannabinoid: newCannabinoid
    });
  }
  
  changeCannabinoidValue(cannabinoid, e){
    let cannabinoidList = this.state.cannabinoid.filter(c => c.name !== cannabinoid.name);
    let cannabinoidNew = cannabinoid;
    cannabinoidNew.value = e.target.value;
    this.setState({
      cannabinoid: [...cannabinoidList, cannabinoidNew] 
    });
  }

  cbSetImageNewLink(link){
    this.setState({ image: link });
  }

  addDefaultSrc(ev){
    ev.target.src = 'https://admin.cannawho.ca/static/media/logo-black-img-not-found.31ff94e5.png'
  }

  render() {

    const { classes } = this.props;
    console.log(this.state.form_type)
    return (
      <div>
      <Typography variant="h4" gutterBottom>
        Add Product - Brand: {this.state.brand.name}
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
              <TextField
                id="outlined-multiline-static"
                label="Description" multiline rows="4" value={this.state.description}
                className={classes.textField} margin="normal" variant="outlined"
                style={{width:'98%', marginLeft:10}} onChange={this.handleChange('description')}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={ref => {this.InputLabelRef = ref;}} htmlFor="outlined-form">
                  Form
                </InputLabel>
                <Select value={this.state.form} onChange={this.handleChange('form')}
                  input={
                    <OutlinedInput labelWidth={this.state.labelWidth} name="form" id="outlined-form" />
                  }
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {this.state.form_type ? this.state.form_type.map(ft => 
                    <MenuItem key={ft.name} value={ft.name}>{ft.name}</MenuItem>
                  )
                  :''}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={ref => {this.InputLabelRef = ref;}} htmlFor="outlined-type">
                  Type
                </InputLabel>
                <Select value={this.state.type} onChange={this.handleChange('type')}
                  input={
                    <OutlinedInput labelWidth={this.state.labelWidth} name="type" id="outlined-type" />
                  }
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {/* {console.log(this.state.form_type.length)} */}
                  { this.state.form !== '' && 
                    this.state.form_type.length === 0
                    ? '' : 
                    (this.state.form_type.filter(ft => ft.name === this.state.form)[0] ?
                      this.state.form_type
                        .filter(ft => ft.name === this.state.form)[0].type
                        .map(t =>
                          <MenuItem value={t.name} key={t.name}>{t.name}</MenuItem>
                        )
                    :
                      '')}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={ref => {this.InputLabelRef = ref;}} htmlFor="outlined-usage-period">
                  Usage Period
                </InputLabel>
                <Select value={this.state.usage_period} onChange={this.handleChange('usage_period')}
                  input={
                    <OutlinedInput labelWidth={this.state.labelWidth} name="usage-period" id="outlined-usage-period" />
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.usagePeriodList.map(upList => 
                    <MenuItem key={upList} value={upList}>{upList}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid container spacing={24} direction="row" justify="center" alignItems="center">
              {(this.fileArray || []).map((url, index) => (
                <Grid className={classes.image_viewer}>
                  <IconButton component="label" style={{ color: '#F6227F', marginBottom: -20, marginLeft: 150}} aria-label="delete" onClick={() => this.removePhoto(index)}>
                    <CancelIcon style={{fontSize: '24px'}}/>
                  </IconButton>
                  { this.state.loadingImage ? <CircularProgress /> : <img alt='...' onError={this.addDefaultSrc} src={url} style={{height: '200px', width: '200px', marginTop: -27}}/>}
                </Grid> ))}
            </Grid>
            <Grid container spacing={24} direction="row" justify="center" alignItems="center" style={{minWidth: '80%'}}>
                <Grid item xs={8} justify="center" align="center" style={{border: 'dashed 2px #979A9B', borderRadius: 8, marginTop: 18, minHeight: '20vh'}}>


                    
                </Grid>
            </Grid>


            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={ref => {this.InputLabelRef = ref;}} htmlFor="outlined-newCannabinoid">
                Cannabinoid
                </InputLabel>
                <Select value={this.state.newCannabinoid} onChange={this.handleChange('newCannabinoid')}
                  input={
                    <OutlinedInput labelWidth={this.state.labelWidth} name="newCannabinoid" id="outlined-newCannabinoid" />
                  }
                  >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.cannabinoidList.map(cannabinoid => 
                    <MenuItem value={cannabinoid} key={cannabinoid}>{cannabinoid}</MenuItem>
                  )}
                </Select>
              </FormControl>
              <Button variant="contained" size="medium" className={classes.button} 
                name="btnAddCannabinoid" onClick={this.addCannabinoid.bind(this)}
              >
                Add Cannabinoid
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.demo}>
                <List>
                  { this.state.cannabinoid.sort((a, b) => { return a.name > b.name ? 1 : -1}).map( c => 
                    <ListItem key={c._id}>
                      <ListItemText
                        primary={c.name}
                        />
                      <TextField variant="outlined" style={{width:'98%', margin:10}} value={c.value} 
                        onChange={this.changeCannabinoidValue.bind(this, c)}/>
                      <ListItemSecondaryAction>
                        <IconButton aria-label="Delete" onClick={this.deleteCannabinoid.bind(this, c.name)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </List>
              </div>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={ref => {this.InputLabelRef = ref;}} htmlFor="outlined-newTerpene">
                Terpene
                </InputLabel>
                <Select value={this.state.newTerpene} onChange={this.handleChange('newTerpene')}
                  input={
                    <OutlinedInput labelWidth={this.state.labelWidth} name="newTerpene" id="outlined-newTerpene" />
                  }
                  >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.state.terpeneList.map(terpene => 
                    <MenuItem value={terpene} key={terpene}>{terpene}</MenuItem>
                  )}
                </Select>
              </FormControl>
              <Button variant="contained" size="medium" className={classes.button} 
                name="btnAddTerpene" onClick={this.addTerpeneChip.bind(this)}
              >
                Add Terpene
              </Button>
            </Grid>
            <Grid item xs={12}>
              {this.state.terpene ? this.state.terpene.map(terpene => (
                <Chip
                  key={terpene}
                  label={terpene}
                  onDelete={this.deleteTerpene.bind(this, terpene)}
                  className={classes.chip}
                />
              ))
              :''
              }
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