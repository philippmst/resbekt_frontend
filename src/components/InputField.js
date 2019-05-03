import React, { Component } from 'react';
import { Col, Button, FormGroup, Label, Input } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';


export class InputField2 extends Component {

  render() {
    return (
        <FormGroup row>
          <Label for={this.props.name}>{this.props.data.label}</Label>
          <Input type={this.props.data.type}
                 name={this.props.name}
                 id={this.props.data.label}
                 placeholder={this.props.data.label}
                 onChange={this.props.onChange}
                 value={this.props.value}/>
        </FormGroup>
      )}
 }


export class InlineInputField extends Component {

  render() {
    const disabled = 'disabled'
    return (
        <FormGroup row>
          <Label for={this.props.name} sm={4} style={{textAlign: 'right'}}>{this.props.data.label}</Label>
          <Col sm={8}>
            { this.props.data.read_only ? <p>this.props.value</p> :
            <Input type={this.props.data.type}
                 name={this.props.name}
                 id={this.props.data.label}
                 placeholder={this.props.data.label}
                 onChange={this.props.onChange}
                 value={this.props.value} disabled={disabled}/>
             }
          </Col>
        </FormGroup>
      )}
 }


 const styles = theme => ({
   container: {
     display: 'flex',
     flexWrap: 'wrap',
   },
   textField: {
     marginLeft: theme.spacing.unit,
     marginRight: theme.spacing.unit,
     width: '100%',
   },
   dense: {
     marginTop: 19,
   },
   menu: {
     width: 200,
   },
 });


class InputField extends Component {
  render() {
    const { classes } = this.props;
    let disabled = undefined 
    // if (this.props.data.read_only) { disabled = 'disabled' }
    if (this.props.data.read_only) {
      return ''
    } else {
      return ( <div>{ this.props.data.type === 'boolean' &&   <div>
        <FormControlLabel control={<Switch name={this.props.name} 
            value={String(this.props.value)} 
            checked={this.props.value}
            onChange={() => {this.props.onChange({target: {name: this.props.name, value: !this.props.value}})}} />} 
            label={this.props.data.label} />
            { this.props.data.help_text && <p style={{fontSize: '11px', color:'grey', marginTop: '-15px'}}>{this.props.data.help_text}</p> }
        </div>              }
        {(this.props.data.type === 'float' || this.props.data.type === 'email' || (this.props.data.type === 'string' && 'max_length' in this.props.data) || this.props.data.type === 'integer' || this.props.data.type === 'date' || this.props.data.type === 'datetime' || this.props.data.type === 'nested object') && <TextField
            id="standard-name"
            label={this.props.data.label}
            className={classes.textField}
            value={this.props.value}
            name={this.props.name}
            onChange={this.props.onChange}
            type={this.props.data.type}
            margin="normal" disabled={disabled} required={this.props.data.required}
            helperText={this.props.data.help_text}
            InputLabelProps={{ shrink: true, }}
          />
        }
        {(this.props.data.type === 'password') && <TextField
            id="standard-password"
            label={this.props.data.label}
            className={classes.textField}
            value={this.props.value}
            name={this.props.name}
            onChange={this.props.onChange}
            type={this.props.data.type}
            margin="normal"              
            helperText={this.props.data.help_text}
            InputLabelProps={{ shrink: true, }}
          />
        }
        { (this.props.data.type === 'string' && !('max_length' in this.props.data)) && <TextField
            id="standard-textfield"
            className={classes.textField}
            label={this.props.data.label}
            value={this.props.value}
            onChange={this.props.onChange}
            name={this.props.name}
            multiline
            rows="5"
            margin="normal" 
            disabled={disabled} 
            helperText={this.props.data.help_text}
            required={this.props.data.required}
            variant="outlined"
          />
        }
        { (this.props.data.type === 'field' && 'choices' in this.props.data  && this.props.data.label !== 'Url' && this.props.data.label !== 'Kundennummer' && this.props.data.label !== 'Mitglied') && <div>
          <TextField id="standard-select" select
              label={this.props.data.label}
              className={classes.textField}
              value={this.props.value}
              onChange={this.props.onChange}
              name={this.props.name}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText={this.props.data.help_text}
              margin="normal"
            >
            {this.props.data.choices.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.display_name}
              </MenuItem>
            ))}
          </TextField>
          </div>
      }</div>

  )}}
}


export default withStyles(styles)(InputField);
