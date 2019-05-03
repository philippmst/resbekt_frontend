import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import * as actions from 'store/actions';
import {withRouter} from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import FormModal from 'components/FormModal';
import { BASE_URL, statusColor } from 'common/constants';
import { arrayRemove } from 'common/helpers';
import { Datum } from 'common/helpers';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import { Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ListIcon from '@material-ui/icons/List';
import BevCard from 'components/BevCard';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit*2,
    right: theme.spacing.unit*2,
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: '25px',
    backgroundColor: 'white',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  }
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
    kfsAlive: state.base.kfsAlive,
  }
}



class GrundStueckDetail extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAlert = this.toggleAlert.bind(this);
    this.toggleNummernDialog = this.toggleNummernDialog.bind(this);
    this.state = {
      loading: true,
      addNummernAlertOpen: true,
      modal: false,
      reservierung: false,
      grundstuecke: [],
      whichNumber: 'unterteilungsnummer',
      stammnummer: 1,
      unterteilungsnummer: null,

    }
  }

  componentDidMount() {
    this.props.setResType('gst');
    axios.get(BASE_URL+'reservierung/'+this.props.match.params.id).then(res => {
      this.setState({loading: false, reservierung: res.data })
      this.props.checkKFSAlive(res);
    })
  }

  
  toggleAlert = () => {
    this.setState({alertOpen: !this.state.alertOpen })
  } 


  toggleGrundStueckNumber = (p) => {
    let r;
    let x = [...this.state.grundstuecke]
    if (this.state.grundstuecke.indexOf(p) > -1) {
      r = arrayRemove(x, p)
    } else {
      x.push(p)
      r = [...x]
    }
    this.setState({grundstuecke: r})
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  }



  addNummern = () => {
    let data = {stammnummer: this.state.stammnummer };
    let url = BASE_URL + 'reservierung/'+this.state.reservierung.res_nr+'/add_stammnummer/'
    if (this.state.whichNumber === 'unterteilungsnummer') {
      let url = BASE_URL + 'reservierung/'+this.state.reservierung.res_nr+'/add_unterteilungsnummer/'
      data['unterteilungsnummer'] = this.state.unterteilungsnummer
    }

    
    axios.patch(url, data).then(
      res => {
        this.props.checkKFSAlive(res);
        this.setState({reservierung: res.data });
        toast.success("Nummern wurden hinzugefügt")
      }).catch(error => {
        console.log(error.response)
        // toast.error(error.response.status+'! '+error.response.data)
      }
      )
    }


    
  sendEmail = () => {
    let url = BASE_URL + 'reservierung/'+this.state.reservierung.res_nr+'/send_mail/'
    axios.post(url).then(res => {
      toast.success("Email wurde verschickt")
      this.props.checkKFSAlive(res);
    })
  }
  
  deleteGrundStuecke = () => {
    let url = BASE_URL + 'reservierung/'+this.state.reservierung.res_nr+'/del_gst/'
    axios.patch(url, { grundstuecke: this.state.grundstuecke.join(',')}).then(res => {
      this.setState({ reservierung: res.data, grundstuecke: [] })
      this.props.checkKFSAlive(res);
    })
  }
  
  deleteReservation = () => {
    let url = BASE_URL + 'reservierung/'+this.state.reservierung.res_nr+'/'
    axios.delete(url).then(res => {
      this.setState({ reservierung: false, loading: true })
      this.props.history.push('/grundstuecke/')
      this.props.checkKFSAlive(res);
    })
  }

  setNumberType  = (event) => {
    this.setState({whichNumber: event.target.value})
  }

  toggleNummernDialog = () => {
    this.setState({ addNummernAlertOpen: !this.state.addNummernAlertOpen })
  }

  render() {
    const { classes } = this.props;
    let angelegt = this.state.reservierung.status === 'A' ? true : false
    let fertig = this.state.reservierung.status === 'F' ? true : false
    let { whichNumber } = this.state
    if (!this.state.kfsAlive ) { whichNumber = 'stammnummer'} 

    return ( <div>
        { this.state.loading ? <h1>Loading...</h1> : <div>

          <ListItem style={{ marginLeft: '-16px'}}>
            <Avatar style={{ backgroundColor: statusColor[this.state.reservierung.status]}}>{this.state.reservierung.status}</Avatar>
            <ListItemText>            
              <h2>Reservierungsnummer: {this.state.reservierung.res_nr}</h2>
            </ListItemText>
          </ListItem>

          <div style={{marginTop: '20px', marginBottom: '10px', marginLeft: '-8px'}}> 
            <Button variant="outlined" className={classes.button} color="primary" onClick={() => this.props.history.push('/grundstuecke/')}>
              <ListIcon className={classes.leftIcon} />zurück zur Übersicht</Button>

            <Button disabled={this.angelegt} variant="outlined" className={classes.button} color="primary" onClick={this.deleteReservation}>
              <DeleteIcon className={classes.leftIcon} />Reservierung löschen
            </Button>
            
            <Button disabled={ this.state.reservierung.grundstueck_set.length === 0  } variant="outlined" className={classes.button} color="primary" onClick={this.sendEmail}>
              <SendIcon className={classes.leftIcon} />Email verschicken
            </Button>
          </div>

          <Card>
            <CardContent>
              <p>Katastralgemeinde: <span style={{ color: 'red'}}>{this.props.kgs.filter(kg => kg.value === this.state.reservierung.kg)[0].label}</span></p>
              <p>Planverfasser: <span style={{ color: 'red'}}>{this.state.reservierung.planverfasser} - {this.state.reservierung.kunde} - {this.state.reservierung.email}</span></p>
              <p>erstellt am: <span style={{ color: 'red'}}><Datum date={this.state.reservierung.created_at} /></span> gültig bis: <span style={{ color: 'red'}}><Datum date={this.state.reservierung.valid_to} /></span></p>
            </CardContent>
          </Card>
                
          {/* <FormModal open={this.state.addNummernAlertOpen} handleClose={this.toggleNummernDialog} title={'Nummern hinzufügen'}> */}
          <Card style={{marginTop: '20px'}}>
            <CardContent>

              <RadioGroup aria-label="Nummernart" name="nummer1" className={classes.group} 
                  value={whichNumber} 
                  onChange={this.setNumberType}
              >
                <FormControlLabel value="stammnummer" control={<Radio color="primary" />} label="Stammnummern" />
                <FormControlLabel value="unterteilungsnummer" control={<Radio color="primary" />} label="Unterteilungsnummer"
                  disabled={!this.state.kfsAlive} />
              </RadioGroup>

              { this.state.whichNumber === 'stammnummer' && <div>
                <p>Bitte geben Sie die Anzahl der gewünschten Grundstücke ein</p>
              </div>}
              { (this.state.whichNumber === 'unterteilungsnummer' && this.state.kfsAlive) && <div>
                <p>Bitte geben Sie die Stammnummer mit der Anzahl der Teilungsnummmern ein</p>
              </div>}

              <TextField required id="stammnummer" defaultValue={this.state.stammnummer} 
                  variant="outlined" label={this.state.whichNumber === 'stammnummer' ? "Anzahl Stammnummern" : 'Stammnummer'} autoFocus={true}
                  onChange={this.handleChange('stammnummer')} type="text" 
                  className={classes.textField} InputLabelProps={{ shrink: true, }} margin="normal"
                  />
              
              { (this.state.whichNumber === 'unterteilungsnummer' && this.state.kfsAlive) && 
                  <TextField required id="unterteilungsnummer" 
                      variant="outlined" label="Unterteilungsnummer"
                      defaultValue={this.state.unterteilungsnummer} 
                      onChange={this.handleChange('unterteilungsnummer')} type="text" 
                      className={classes.textField} style={{marginLeft: '15px'}}
                      InputLabelProps={{ shrink: true, }} 
                      margin="normal" 
                      />}
              <DialogActions>
                <Button color="primary" variant="contained" onClick={this.addNummern}>anlegen</Button>
              </DialogActions>

            </CardContent>
          </Card>
            {/* </FormModal> */}
            
          <h4 style={{marginTop: '30px'}}>Liste der reservierten Grundstücksnummern</h4> 
                {/* <TextField required id="punkt" 
                  variant="outlined" 
                  label="Anzahl Stammnummern" 
                  style={{ backgroundColor: 'white'}} 
                  autoFocus={true}
                  defaultValue={this.state.stammnummern} 
                  onChange={this.handleChange('stammnummern')} 
                  type="text" className={classes.textField} 
                  InputLabelProps={{ shrink: true, }} 
                  margin="normal" 
                />


                { this.props.kfsAlive && <div>
                    <br />
                    <TextField required id="unter_haupt" variant="outlined" label="Stammnnummmern" defaultValue={this.state.unter_haupt} onChange={this.handleChange('unter_haupt')} type="text" className={classes.textField} InputLabelProps={{ shrink: true, }} margin="normal" />
                    <TextField style={{marginLeft: '20px'}} variant="outlined" label="Anzahl Teilungsnummmern"  required id="unter_anz" defaultValue={this.state.unter_anz} onChange={this.handleChange('unter_anz')} type="text" className={classes.textField} InputLabelProps={{ shrink: true, }} margin="normal" /><br />
                    <Button variant="outlined" className={classes.button} disabled={fertig} onClick={this.addUnterteilungsnummer} color="primary">
                      <AddIcon className={classes.leftIcon} />Unterteilungsnummer hinzufügen</Button>            
                  </div>
                }

              <br /> */}
              <Button variant="outlined" className={classes.button} disabled={fertig} onClick={this.toggleNummernDialog} color="primary">
                <AddIcon className={classes.leftIcon} />Nummern hinzufügen</Button>            
              <Button variant="outlined" className={classes.button} disabled={this.state.grundstuecke.length === 0 } color="primary"  onClick={this.deleteGrundStuecke}>
                <DeleteIcon className={classes.leftIcon} />Nummern löschen</Button>

              <ul>{this.state.reservierung.grundstueck_set.map((v,i) => ( <FormControlLabel key={i} checked={ this.state.grundstuecke.indexOf(v.nr) > -1 } control={ <Checkbox 
                      onChange={() => this.toggleGrundStueckNumber(v.nr)}
                      value="checkedB"
                      color="primary"
                      />
                    }
                    label={v.nr}
                    />
                    ))}
              </ul>



          </div>}
        </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GrundStueckDetail)))
