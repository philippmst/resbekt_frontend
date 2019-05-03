import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../store/actions';
import axios from 'axios';
import { BASE_URL } from '../common/constants';

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
  }
}

const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
  }
}



class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loading: false,
    }
  }

  componentDidMount() {
    this.props.setTitle("Dashboard");
    console.log(this.props.config)
    axios.get(BASE_URL+'dashboard/',this.props.config).then(res => {
      console.log(res.data)
      this.setState({loading: false, dashboard: res.data })
    })
  }

  render() {
    return (
      <div>
        <h3>Dashboard</h3>
        {this.state.loading ? 'Es wird geladen' : 'Fertig geladen'}
      </div>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));
