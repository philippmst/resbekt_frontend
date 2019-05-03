import React, { Component } from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {Link, withRouter} from 'react-router-dom';


const Menu = props =>  (
    <div style={{height:'100%', backgroundColor: 'rgba(255,255,255,0.7)', marginRight:'-15px', color: 'white'}}>
      <MenuList>
        <MenuItem style={{textAlign: 'center'}}>Event</MenuItem>
        <Divider />

        <MenuItem button component={Link} to={'/tickets/'}>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary='Tickets' />
        </MenuItem>
        
        <MenuItem button component={Link} to={'/activities/'}>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary='Activities' />
        </MenuItem>   
        
        <MenuItem button component={Link} to={'/exhibition/'}>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary='Exhibition' />
        </MenuItem>
        
        <MenuItem button component={Link} to={'/companies/'}>
            <ListItemIcon><MailIcon /></ListItemIcon>
            <ListItemText primary='Company' />
        </MenuItem>

    
      </MenuList>
    </div>
);

export default Menu;