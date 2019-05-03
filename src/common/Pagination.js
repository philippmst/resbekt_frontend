import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme } from "@material-ui/core/styles";
import Pagination from "material-ui-flat-pagination";
import MenuItem from '@material-ui/core/MenuItem';
import { Container, Row, Col, } from 'reactstrap';

const theme = createMuiTheme();


const styles = theme => ({
  root: {
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
});

class Mitglieder extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { classes } = this.props;
    return <Row style={{ marginTop: '25px'}}>
        <Col sm={2}>
          <TextField id="standard-select-currency" select className={classes.textField} style={{marginTop: '0px' }}
            value={this.props.pagination} onChange={this.props.changePagination }
            SelectProps={{ MenuProps: { className: classes.menu, }, }} margin="normal">
            <MenuItem key='10' value={10}>10</MenuItem>
            <MenuItem key='25' value={25}>25</MenuItem>
            <MenuItem key='50' value={50}>50</MenuItem>
            <MenuItem key='100' value={100}>100</MenuItem>
          </TextField>
        </Col>
        <Col>
          <Pagination
            limit={1}
            offset={this.props.offset}
            total={Math.ceil(this.props.count/this.props.pagination)}
            onClick={(e, offset) => this.props.changeOffset(offset)}
            />
        </Col>
      </Row>
    }
}

export default withStyles(styles)(Mitglieder);
