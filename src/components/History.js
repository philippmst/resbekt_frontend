import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import * as c from 'common/constants';
import { Datum } from 'common/helpers';


const History = props => (
      <div>
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">History Reservierung</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                <List>
                  {props.data.map((v,i) => (
                    <ListItem key={i}>
                        <Avatar style={{backgroundColor: c.colors.red }}>{v.username[0]}</Avatar>
                        <ListItemText primary={v.log} secondary={<div>{v.username} - <Datum date={v.created_at} /></div>} />
                    </ListItem>
                  ))}

                </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
     
            <Button onClick={props.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
);

export default History;