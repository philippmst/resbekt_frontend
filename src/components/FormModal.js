import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';

const styles = theme => ({
  paper: {
    position: 'absolute',
    minWidth: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class FormModal extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { classes } = this.props;

    return (
        <Dialog fullWidth={true} style={{minWidth: '500px'}} scroll="paper" open={this.props.open} onClose={this.props.handleClose}>
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>
            {this.props.children}
          </DialogContent>
       </Dialog>
    );
  }
}

FormModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(FormModal);
