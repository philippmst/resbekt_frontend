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
import CardContent from '@material-ui/core/CardContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import FormModal from 'components/FormModal';
import * as c from 'common/constants';
import { arrayRemove } from 'common/helpers';
import { Datum } from 'common/helpers';
import { toast } from 'react-toastify';
import History from 'components/History';
import DeleteIcon from '@material-ui/icons/Delete';
import AlarmIcon from '@material-ui/icons/Alarm';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ListIcon from '@material-ui/icons/List';


const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit*2,
    right: theme.spacing.unit*2,
  },
  button: {
    margin: theme.spacing.unit,
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
  }
}



class GrenzPunkte extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAlert = this.toggleAlert.bind(this);
    this.togglePointAlert = this.togglePointAlert.bind(this);
    this.toggleHistory = this.toggleHistory.bind(this);
    this.state = {
      loading: true,
      addPointAlertOpen: false,
      modal: false,
      reservierung: false,
      grenzpunkte: [],
      whichPoint: 'point_num',
      punkt_value: 7,
      history: false,
    }
  }

  componentDidMount() {
    this.props.setResType('gpkt')
    axios.get(c.PUNKT_BASE_URL+'reservierung/'+this.props.match.params.id).then(res => {
      this.setState({loading: false, reservierung: res.data })
      this.props.checkKFSAlive(res);
    })
  }
  
  
  toggleAlert = () => {
    this.setState({alertOpen: !this.state.alertOpen })
  } 
  togglePointAlert = () => {
    this.setState({addPointAlertOpen: !this.state.addPointAlertOpen })
  } 
  
  toggleHistory = () => {
    this.setState({history: !this.state.history })
  }

  togglePointNumber = (p) => {
    let r;
    let x = [...this.state.grenzpunkte]
    if (this.state.grenzpunkte.indexOf(p) > -1) {
      r = arrayRemove(x, p)
    } else {
      x.push(p)
      r = [...x]
    }
    this.setState({grenzpunkte: r})
  }
  
  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  }
  
  addReservation = () => {
    axios.post(c.PUNKT_BASE_URL+'reservierung/', {kg: this.state.reservierung.kg, kunde: this.state.kunde}).then(res => {
      this.setState({reservierung: res.data});
      this.toggleAlert();
      this.props.checkKFSAlive(res);
    });
  }
  
  addPointsDialog = () => {
    this.setState({addPointAlertOpen: !this.state.addPointAlertOpen })
  }

  addPoints = () => {
    let data = {kg: this.state.reservierung.kg};
    let url = this.state.reservierung.url
    if (this.state.whichPoint === 'point_num') {
      url += 'add_gpkt/'
      data['point_nums'] = this.state.punkt_value;
    } else {
      url += 'add_gpkt_nr/'
      data['point_vals'] = this.state.punkt_value;
    }
    axios.post(url, data).then(
      res => {
        console.log(res)
        this.setState({reservierung: res.data, addPointAlertOpen: false});
        this.props.checkKFSAlive(res);
      }).catch(error => {
        console.log(error.response)
        toast.error(error.response.status+'! '+error.response.data)
      }
      )
    }
    
    sendEmail = () => {
      axios.post(this.state.reservierung.url+'send_mail/').then(res => {
        this.props.checkKFSAlive(res);
        toast.success("Email wurde verschickt")
      })
    }
    
    deletePoints = () => {
      axios.post(this.state.reservierung.url+'del_gpkt/', { points: this.state.grenzpunkte.join(',')}).then(res => {
        this.props.checkKFSAlive(res);
        this.setState({ reservierung: res.data, grenzpunkte: [] })
      })
    }
    
    deleteReservation = () => {
      axios.delete(this.state.reservierung.url).then(res => {
        this.props.checkKFSAlive(res);
        this.setState({ reservierung: false, loading: true })
        this.props.history.push('/punkte/')
    })
  }

  setPointType  = (event) => {
    this.setState({whichPoint: event.target.value})
  }

  render() {
    const { classes } = this.props;
    let angelegt = this.state.reservierung.status === 'A' ? true : false
    let fertig = this.state.reservierung.status === 'F' ? true : false

    return ( <div>
        { this.state.loading ? <h1>Loading...</h1> : <div>
            <h2 style={{marginTop: '20px', marginBottom: '20px'}}>Reservierungsnummer: {this.state.reservierung.id}</h2>

            <Button variant="outlined" className={classes.button} color="primary" onClick={() => this.props.history.push('/punkte/')}>
              <ListIcon className={classes.leftIcon} />zurück zur Übersicht</Button>

            <Button disabled={this.angelegt} variant="outlined" className={classes.button} color="primary" onClick={this.deleteReservation}>
              <DeleteIcon className={classes.leftIcon} />Reservierung löschen
            </Button>
            <Button disabled={this.state.reservierung.history.length === 0 } variant="outlined" className={classes.button} color="primary" onClick={this.toggleHistory}>
              <AlarmIcon className={classes.leftIcon} />History anzeigen
            </Button>           
            
            <Button disabled={ this.state.reservierung.punkt_set.length === 0  } variant="outlined" className={classes.button} color="primary" onClick={this.sendEmail}>
              <SendIcon className={classes.leftIcon} />Email verschicken
            </Button>

            <History open={this.state.history} handleClose={this.toggleHistory} data={this.state.reservierung.history} />

            <FormModal open={this.state.addPointAlertOpen} handleClose={this.togglePointAlert} title={'Punkte hinzufügen'}>
              <RadioGroup aria-label="Punktart" name="punkt1" className={classes.group} 
                  value={this.state.whichPoint} 
                  onChange={this.setPointType}
              >
                <FormControlLabel value="point_num" control={<Radio color="primary" />} label="Punktanzahl" />
                <FormControlLabel value="point_val" control={<Radio color="primary" />} label="spezifische Punkte" />
              </RadioGroup>

              { this.state.whichPoint == 'point_num' && <div>
                <p>Bitte geben Sie die Punktanzahl ein</p>
              </div>}
              
              { this.state.whichPoint == 'point_val' && <div>
                <p>Bitte geben Sie die gewünschten Punkte ein</p>
              </div>}
              <TextField required id="punkt" defaultValue={this.state.punkt_value} onChange={this.handleChange('punkt_value')} type="text" className={classes.textField} InputLabelProps={{ shrink: true, }} margin="normal" />
              <DialogActions>
                <Button color="primary" variant="contained" onClick={this.addPoints}>anlegen</Button>
              </DialogActions>

            </FormModal>
                <Card>
                  <CardContent>
                    <p>Katastralgemeinde: <b>{this.props.kgs.filter(kg => kg.value === this.state.reservierung.kg)[0].label}</b></p>
                    <p>Kunde: <b>{this.state.reservierung.kunde}</b></p>
                    <p>Planverfasser: <b>{this.state.reservierung.planverfasser}</b></p>
                    <p>Email: <b>{this.state.reservierung.email}</b></p>
                    <p>erstellt am: <b><Datum date={this.state.reservierung.created_at} /></b></p>
                    <p>gültig bis: <b><Datum date={this.state.reservierung.valid_to} /></b></p>
                    <p>Status: <b>{this.state.reservierung.status}</b></p>
                    
                  </CardContent>
                </Card>

            
            <h4 style={{marginTop: '30px'}}>Punktliste</h4>
            <Button variant="outlined" className={classes.button} disabled={fertig} onClick={this.addPointsDialog} color="primary">
              <AddIcon className={classes.leftIcon} />Punkte hinzufügen</Button>            
            <Button variant="outlined" className={classes.button} disabled={this.state.grenzpunkte.length === 0 } color="primary"  onClick={this.deletePoints}>
              <DeleteIcon className={classes.leftIcon} />Punkte löschen</Button>

            <ul>{this.state.reservierung.punkt_set.sort((a,b) => a.nummer < b.nummer).map((v,i) => ( <FormControlLabel key={i} checked={ this.state.grenzpunkte.indexOf(v.nummer) > -1 } control={ <Checkbox 
                    onChange={() => this.togglePointNumber(v.nummer)}
                    value="checkedB"
                    color="primary"
                  />
                }
                label={v.nummer}
              />
            ))}
            </ul>



          </div>}
        </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GrenzPunkte)))
