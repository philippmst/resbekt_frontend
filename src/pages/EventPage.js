import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../store/actions';
import axios from 'axios';
import { BASE_URL } from '../common/constants';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import MapIcon from '@material-ui/icons/Place';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import { Redirect } from 'react-router-dom'


const styles = theme => ({
  root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setTitle: (title) => dispatch(actions.base.setTitle(title)),
    login: (username, password) => dispatch(actions.auth.login(username, password)),
    setEvent: (e) => dispatch(actions.auth.setEvent(e)),
  }
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    event: state.auth.event,
  }
}



class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      events: [],
    }
  }

  componentDidMount() {
    this.props.setTitle("Events");
    axios.get( BASE_URL+'event/', this.props.config).then(res => {
      this.setState({events: res.data.results, loading: false, })
    });
  }

  setEvent = i => {
    this.props.setEvent(this.state.events[i]);
  }

  renderRedirect = () => {
    // console.log(this.props.event);
    if (this.props.event !== null) {
      // console.log("juhu")
      return <Redirect to='/' />
    } else {
      console.log("pfui")
    }
  }

  render() {

    return (<div>
      {this.renderRedirect()}

      {this.state.loading ? <h4>Events werden geladen...</h4> : <div>
        <List className='classes.root'>
          {this.state.events.map((e,i) => (
            <ListItem key={i} dense button  onClick={() => (this.setEvent(i))}>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
              <ListItemText primary={e.name} secondary={<React.Fragment>
                  <MapIcon /> {e.location} <CalendarIcon /> {e.start} - {e.end}
                </React.Fragment>
              } />
            </ListItem>
          ))}
        </List>
      </div>}
    </div>
    )
  }
}

EventPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EventPage));
