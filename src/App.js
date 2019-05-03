import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from './store/actions';
import './App.css';
import Menu from './components/Menu';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Titelleiste from './components/Titelleiste';
import { Container, Row, Col } from 'reactstrap';
import GrenzPunkte from 'components/Grenzpunkte';
import GrundStuecke from 'components/Grundstuecke';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GrenzPunktDetails from 'components/Grenzpunkte/detail';
import GrundStueckDetails from 'components/Grundstuecke/detail';
import KFStot from 'components/KFStot';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit, 
  },
})



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadKGs: (title) => dispatch(actions.base.loadKGs(title)),
    setResType: resType => dispatch(actions.base.setResType(resType)),
  }
}

const mapStateToProps = (state) => {
  return {
    kgs: state.base.kgs,
  }
}



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isAuthenticated: true,
    };
  }

  componentDidMount() {
    this.props.setResType('nix');
    this.props.loadKGs();
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Titelleiste />
        <Row>
          <Container>
            <Row>
                <Route path="/grundstuecke" component={ KFStot } />
                <Route exact path="/grundstuecke/" component={ GrundStuecke } />
                <Route exact path="/grundstuecke/:id" component={ GrundStueckDetails } />
                <Route exact path="/punkte/" component={ GrenzPunkte } />
                <Route exact path="/punkte/:id" component={ GrenzPunktDetails } />
            </Row>
          </Container>
        </Row>
        <ToastContainer />

      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App)))
