import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from 'store/actions';
import {withRouter} from 'react-router-dom';
import Table from 'components/Table';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import FormModal from 'components/FormModal';
import AsyncSelect from 'react-select/lib/Async';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DialogActions from '@material-ui/core/DialogActions';
import { BASE_URL, statusColor } from 'common/constants';
import moment from 'moment';
import { Avatar } from '@material-ui/core';
import { Datum } from 'common/helpers';


const styles = theme => ({
  
}); 

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadKGs: (title) => dispatch(actions.base.loadKGs(title)),
    checkKFSAlive: (response) => dispatch(actions.base.checkKFSAlive(response)),
    setResType: resType => dispatch(actions.base.setResType(resType)),
  }
}

const mapStateToProps = (state) => {
  return {
    kgs: state.base.kgs,
    kfsAlive: state.base.kfsAlive,
  }
}




class GrundStuecke extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAlert = this.toggleAlert.bind(this);
    this.state = {
      alertOpen: false,
      modal: false,
      reservierungen: [],
      kg: 0,
      kunde: 0,
      valid_to: moment().add(2,'years').format('YYYY-MM-DD'),
      interne: false,
      planverfasser: '',

    }
  }

  columns =  [
    {name: "kg", align: "left"},
    {name: "email", align: "left"},
    {name: "company", align: "left"},
  ];

  componentDidMount() {
    this.props.setResType('gst');
    
    axios.get("http://localhost:4000/api/reservierung/").then(res => {
      this.setState({ reservierungen: res.data });      
      this.props.checkKFSAlive(res);
    })
  }
  
  addReservation = () => {
    let data = {
      kg: this.state.kg, 
      company: this.state.kunde,
      email: this.state.email,
      planverfasser: this.state.planverfasser,
      valid_to: this.state.valid_to,
    }
    
    axios.post(BASE_URL+'reservierung/', data).then(res => {
      this.setState({reservierung: res.data});
      this.props.history.push('/grundstuecke/'+res.data.res_nr)
      this.toggleAlert();
      this.props.checkKFSAlive(res);
      
    });
  }
  
  toggleAlert = () => {
    this.setState({alertOpen: !this.state.alertOpen })
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  }

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked, company: 0 });
  };

  handleKGChange = kg => {
    this.setState({kg: kg.value})
  }

  handleInputChange = (newValue: string) => {
    const inputValue = newValue.toLowerCase()//;.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };


  render() {
    const { classes } = this.props;
    
    const loadOptions = (inputValue, callback) => {
      callback(this.props.kgs.filter( kg => (kg.label.toLowerCase().indexOf(inputValue)> -1 )).slice(0,50) )
    }

    return ( <div style={{marginTop: '30px', width: '100%'}}>

        <Button variant="outlined" className={classes.button} onClick={this.toggleAlert} color="primary">
          <AddIcon className={classes.leftIcon} />Reservierung anlegen</Button>      



          <FormModal open={this.state.alertOpen} 
                handleClose={this.toggleAlert}
                title={'Neue Reservierung anlegen'}>

                <FormControlLabel control={<Switch color="primary" checked={this.state.interne} onChange={this.handleCheck('interne')} value="interne" />}
                label="interne Reservierung" />

                <AsyncSelect
                  // cacheOptions
                  loadOptions={loadOptions}
                  // defaultOptions
                  onInputChange={this.handleInputChange}
                  onChange={this.handleKGChange}
                  placeholder="Katastralgemeinde"
                />

                { !this.state.interne && <TextField
                    required
                    id="kunde"
                    label="Kunde"
                    defaultValue={23}
                    onChange={this.handleChange('kunde')}
                    type="text"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />
                }

                <br />
                <TextField id="planverfasser" label="Planverfasser" onChange={this.handleChange('planverfasser')}
                    type="text"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />  

                <br />
                <TextField id="email" label="Email-Adresse" onChange={this.handleChange('email')}
                    type="email"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />  

                <br />
                <TextField id="valid_to" label="valid_to" onChange={this.handleChange('valid_to')}
                    type="date"
                    defaultValue={this.state.valid_to}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />  

                <DialogActions>
                  <Button onClick={this.toggleAlert} color="secondary">
                    Abbrechen
                  </Button>
      
                  <Button onClick={this.addReservation} color="primary">
                    Save
                  </Button> 
                </DialogActions>
            </FormModal>


      <Card style={{ marginTop: '20px'}}>
        <CardContent>
          <TextField style={{ marginTop: '20px', marginBottom: '20px', width: '100%'}}
                value={this.state.filterByName}
                onChange={this.changeName}
                onKeyPress={this._handleKeyPress}
                variant="outlined"
                autoFocus={true}
                label="Search" />
          
          { this.state.reservierungen && <List>
              { this.state.reservierungen.map((v,i) => (
                <ListItem button onClick={() => this.props.history.push('/grundstuecke/'+v.res_nr) } key={i}>
                  <Avatar style={{ backgroundColor: statusColor[v.status]}}>{v.status}</Avatar>
                  <ListItemText 
                    primary={v.res_nr +" - " +v.planverfasser + ' ('+v.company+')'} 
                    secondary={<div>{(this.props.kgs.filter(kg => kg.value === v.kg)[0].label)} - <Datum date={v.created_at} /></div>} 
                  />                </ListItem>
              ))}
              
            </List>
          }
        </CardContent>
      </Card>
        
        {/* <Table titel="Reservierungen" 
          url="http://localhost:4000/api/reservierung/" 
          detailUrl='/reservierung/'
          location={this.props.location}
          searchFieldName='namefilter' 
          config={this.props.config}
          showNewButton={false}
          columns={this.columns} /> */}


      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GrundStuecke)))
