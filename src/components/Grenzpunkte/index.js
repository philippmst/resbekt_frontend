import React from 'react';
import axios from 'axios';
import Table from 'components/Table';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import * as actions from 'store/actions';
import {withRouter} from 'react-router-dom';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import FormModal from 'components/FormModal';
import { PUNKT_BASE_URL, statusColor } from 'common/constants';
import { arrayRemove } from 'common/helpers';
import { Datum } from 'common/helpers';
import { toast } from 'react-toastify';
import AsyncSelect from 'react-select/lib/Async';
import moment from 'moment';
import { Avatar } from '@material-ui/core';

const styles = theme => ({


}); 

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadKGs: (title) => dispatch(actions.base.loadKGs(title)),
    setResType: resType => dispatch(actions.base.setResType(resType)),
    checkKFSAlive: (response) => dispatch(actions.base.checkKFSAlive(response)),
  }
}

const mapStateToProps = (state) => {
  return {
    kgs: state.base.kgs,
  }
}




class GrenzPunkte extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAlert = this.toggleAlert.bind(this);
    this.state = {
      alertOpen: false,
      addPointAlertOpen: false,
      modal: false,
      kg: 0,
      kunde: 0,
      reservierungen: [],
      whichPoint: 'point_num',
      punkt_value: 7,
      selectedOption: null,
      interne: false,
      valid_to: moment().add(2,'years').format('YYYY-MM-DD'),

    }
  }

  columns =  [
    {name: "id", align: "left", type: 'string' },
    {name: "kg", align: "left", type: 'string' },
    {name: "kunde", align: "left", type: 'string' },
    {name: "status", align: "left", type: 'string' },
    {name: "created_at", align: "left", type: 'date' },
  ];

  toggleAlert = () => {
    this.setState({alertOpen: !this.state.alertOpen })
  } 
 
  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  }

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked });
  };


  handleKGChange = kg => {
    this.setState({kg: kg.value})
  }

  addReservation = () => {
    let data = {
      kg: this.state.kg, 
      kunde: this.state.kunde,
      email: this.state.email,
      planverfasser: this.state.planverfasser,
      valid_to: this.state.valid_to,
    }
    axios.post(PUNKT_BASE_URL+'reservierung/', data).then(res => {
      this.setState({reservierung: res.data});
      this.props.history.push('/punkte/'+res.data.id)
      this.toggleAlert();

    });
  }

  handleInputChange = (newValue: string) => {
    const inputValue = newValue.toLowerCase()//;.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  componentDidMount() {
    this.props.setResType('gpkt')
    axios.get(PUNKT_BASE_URL + 'reservierung/').then(res => {
      this.setState({ reservierungen: res.data.results })
    })
  }

  _handleKeyPress = event => {
    console.log(event.key);
    if (event.key === 'Enter') {
      axios.get(PUNKT_BASE_URL + 'reservierung/?filterByName='+this.state.filterByName).then(res => {
        this.setState({ reservierungen: res.data.results })
      })
    }
  }

  render() {
    const { classes } = this.props;


    const loadOptions = (inputValue, callback) => {
      callback(this.props.kgs.filter( kg => (kg.label.toLowerCase().indexOf(inputValue)> -1 )).slice(0,50) )
    }

    return ( <div style={{marginTop: '30px', width: '100%'}}>



        <Button variant="outlined" className={classes.button} onClick={this.toggleAlert} color="primary">
          <AddIcon className={classes.leftIcon} />Reservierung anlegen</Button>      


        { !this.state.reservierung && <div>

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
            <TextField 
                  id="suche"
                  label="Suche"
                  style={{ marginTop: 8 }}
                  placeholder="Suche nach KGNr, Kundennr, KGName"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  inputLabelProps={{ shrink: true, }}
                  
                  value={this.state.filterByName}
                  onChange={this.handleChange('filterByName')}
                  onKeyPress={this._handleKeyPress}
                  autoFocus={true}
                  />


            {/* <Table titel="Reservierungen" 
              url="http://localhost:5000/api/reservierung/" 
              detailUrl='/reservierung/'
              detailFunction={row => this.setState({reservierung: row})}
              location={this.props.location}
              searchFieldName='namefilter' 
              config={this.props.config}
              showNewButton={false}
              columns={this.columns} /> */}

            { this.state.reservierungen && <List>
              { this.state.reservierungen.map((v,i) => (
                <ListItem button onClick={() => this.props.history.push('/punkte/'+v.id) } key={i}>
                  <Avatar style={{ backgroundColor: statusColor[v.status]}}>{v.status}</Avatar>
                  <ListItemText 
                    primary={v.id +" - " +v.planverfasser + ' ('+v.kunde+')'} 
                    secondary={<div>{(this.props.kgs.filter(kg => kg.value === v.kg)[0].label)} - <Datum date={v.created_at} /></div>} 
                  />
                </ListItem>
              ))}
              
            </List>
            }
          </CardContent>
        </Card>

        </div>
      }
    </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GrenzPunkte)))
