import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
 
 
const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  card: {
    backgroundColor: "white",
    cursor: "pointer",
    paddingTop: '4px',
    paddingBottom: '4px',
  }
});
 
 
class BevCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            show: this.props.show,
        }
    }
 
    // componentWillReceiveProps(nextProps) {
    //   this.setState({ show: nextProps.show, open: nextProps.open });
    // }
 
    toggleOpen = () => {
      this.setState({ open: !this.state.open})
    }
 
  
    render() {
        const { classes } = this.props;
 
        return (<div>{ this.state.show ? <Grid item xs={12} sm={12}>
            <Card style={{marginBottom: 20}}>
              <CardHeader className={classes.card} onClick={this.toggleOpen}
                title={<span style={{fontWeight: 'bold', fontSize: '16px' }} >{this.props.title}</span>}
                action={this.state.open ? <ExpandLessIcon style={{marginTop: '10px'}}/> : <ExpandMoreIcon style={{marginTop: '10px'}}/>}/>

              <Divider />
              {this.state.open && <CardContent>
                        {this.props.children}
                </CardContent>
              }
              </Card>
            </Grid> : null }
          </div>
        );
    }
}
 
BevCard.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  show: PropTypes.bool,
}


BevCard.defaultProps = {
  title: 'noTitle',
  open: true,
  show: true,
}


 
export default withStyles(styles)(BevCard);