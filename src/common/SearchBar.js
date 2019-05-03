import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';


const SearchBar = (props) => (

    <TextField value={props.value} 
        onBlur={props.load} 
        onKeyDown={(e) => { if (e.keyCode === 13) {props.load()}} }
        onChange={props.changeValue}
        margin="normal" 
        label={props.label}
        helperText={props.help_text}
        InputLabelProps={{ shrink: true, }} />
)

export default SearchBar;