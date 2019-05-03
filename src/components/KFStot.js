import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from 'store/actions';
import {withRouter} from 'react-router-dom';
import Table from 'components/Table';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from 'reactstrap';
import FormModal from 'components/FormModal';
import AsyncSelect from 'react-select/lib/Async';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DialogActions from '@material-ui/core/DialogActions';
import { BASE_URL } from 'common/constants';
import moment from 'moment';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit*2,
    right: theme.spacing.unit*2,

  }
}); 

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadKGs: (title) => dispatch(actions.base.loadKGs(title)),
    checkKFSAlive: (response) => dispatch(actions.base.checkKFSAlive(response)),
  }
}

const mapStateToProps = (state) => {
  return {
    kgs: state.base.kgs,
    kfsAlive: state.base.kfsAlive,
  }
}




class KFStot extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {

    return ( <div style={{marginTop: '30px', width: '100%'}}>
        { !this.props.kfsAlive && <Alert color="danger">Oh Gott, KFS ist tot! Es stehen nicht alle Funktionen zur Verfügung.</Alert>}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KFStot)))
