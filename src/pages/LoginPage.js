import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../store/actions';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, } from 'reactstrap';
import InputField from '../components/InputField';
import { Alert } from 'reactstrap';


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
  let errors = [];
  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map(field => {
      return {field, message: state.auth.errors[field]};
    });
  }
  return {
    errors,
    members: state.base.members,
    auth: state.auth,
  }
}

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      username: "",
      password: "",
    }
  }

  componentDidMount() {
    this.props.setTitle("Login");
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.login(this.state.username, this.state.password);
  }


  render() {
    if (this.props.auth.isAuthenticated) {
      return <Redirect to="/" />
    }
    return (
      <Container>
        <form onSubmit={this.onSubmit}>
          { this.props.auth.errors.non_field_errors ? <div>
            {this.props.auth.errors.non_field_errors.map(x => <Alert color="danger">{x}</Alert>)}
            </div> : undefined }

          <fieldset>
              <InputField name={'username'} data={{'type': 'string', 'label': 'Username', 'max_length': 100}}
                  value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>

              <InputField name={'password'} data={{'type': 'password', 'label': 'Password', 'max_length': 100}}
                  value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>

            <p>
              <button type="submit">Login</button>
            </p>

          </fieldset>
        </form>
      </Container>
    )
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginPage));
