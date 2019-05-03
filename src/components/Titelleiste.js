import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../store/actions';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LogoutIcon from '@material-ui/icons/ExitToAppRounded';
import UserIcon from '@material-ui/icons/AccountCircle';
import { colors } from 'common/constants';

import { Container, Row, Col } from 'reactstrap';


const styles = theme => ({
    button: {
      margin: theme.spacing.unit, 
      color: 'white',
      text: {color: 'white'},
    },
    activeButton: {
      margin: theme.spacing.unit,
      color: 'red',
      // borderBottom: '2px solid red',
      // text: { color: 'red'},
    }
  })
  


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      setTitle: (title) => dispatch(actions.base.setTitle(title)),
      loadUser: () => dispatch(actions.auth.loadUser()),
      hasPermission: (groupname) => actions.auth.hasPermission(groupname),
      logout: () => dispatch(actions.auth.logout()),
      leaveEvent: () => dispatch(actions.auth.setEvent(null)),
      
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      title: state.base.title,
      resType: state.base.resType,
      auth: state.auth,
      isLoading: state.auth.isLoading,
      event: state.auth.event,
    }
  }
  

class Titelleiste extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: null,
        }
    };

    handleClick = event => {
        this.setState({ toggle: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ toggle: null });
    };


  render() {
    let {toggle} = this.state;
    const { classes } = this.props;

    return (<div>
        <Row style={{width: '100%', height:'110px', backgroundColor: colors.white,paddingTop:'10px', borderBottom: '2px solid '+colors.red}} >
          <Container>
            <Row>
              <Col xs="6" onClick={() => this.props.history.push('/')}>
                <img src="/images/bev_cmyk.png" height='70px' style={{ marginTop: '10px', cursor: 'pointer'}}  />
              </Col>
              <Col xs="6">
                <span style={{ color: colors.black, fontWeight: 'bold', fontSize: '40px', textAlign: 'right', display: 'block'}}>GruPu</span>
                <span style={{ color: colors.grey, display: 'block', textAlign: 'right'}}><UserIcon />bipo</span>
              </Col>
            </Row>
          </Container>
        </Row>
        <Row style={{ backgroundColor: colors.grey, borderBottom: '2px solid '+colors.red }}>
          <Container>
            <Row >
              <div style={{marginTop: '10px', marginBottom:'10px'}}>
                <Button  to="/grundstuecke/" component={Link}><span className={this.props.resType === 'gst' ? classes.activeButton : classes.button}>Grundstücke</span></Button>
                {/* <Button color="secondary" disabled className={classes.button}>Grenzlinien</Button> */}
                <Button color="primary" component={Link} to="/punkte/" className={this.props.resType === 'gpkt' ? classes.activeButton : classes.button}>Grenzpunkte</Button>
              </div>
            </Row>
          </Container>
        </Row>
        </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Titelleiste));







