import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Col, Button, FormGroup, Label, Input } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import InputField from './InputField';
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';
import AlertDialog from './Alert';


const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
  }
}


export class Form extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      alertopen: false,
      modal: false
    }
  }

  handleSave() {
    if (this.props.values.id === "new") {
      axios.post(this.props.postUrl, this.props.values, this.props.config).then(res => {
        this.props.handleCancel();
        this.props.postSave(res.data);
      })
    } else {
      axios.patch(this.props.values.url, this.props.values, this.props.config).then(res=> {
        console.log("aha")
        this.props.handleCancel();
        this.props.postSave(res.data);
      })
    }
  }

  handleDelete() {
    axios.delete(this.props.values.url, this.props.config).then(res => {
      this.setState({alertopen: false})
      this.props.handleCancel();
      this.props.handleDelete(this.props.values.url);
    })
  }

  render() {
    return ( <div>
      {Object.keys(this.props.options).map( (v) => (
        <InputField name={v}
            data={this.props.options[v]} value={this.props.values[v]} onChange={this.props.onChange}/>

      ))}
      <DialogActions>
        <Button onClick={this.props.handleCancel} color="secondary">
          Abbrechen
        </Button>
        { this.props.values.url !== "new" &&
          <Button onClick={() => {this.setState({alertopen: true})} } color="secondary">
            Delete
          </Button>
        }
        <Button onClick={this.handleSave} color="primary">
          Save
        </Button> 
      </DialogActions>
      <AlertDialog open={this.state.alertopen} title="Löschen" 
          context="Möchten Sie den Datensatz wirklich löschen?!?"
          handleClose={() => this.setState({ alertopen: false })}
          handleAgree={this.handleDelete}
      />

    </div>
    )}
 }

 Form.propTypes = {
   options: PropTypes.object.isRequired,
   values: PropTypes.object.isRequired,
   onChange: PropTypes.func.isRequired,
   handleCancel: PropTypes.func.isRequired,
   handleDelete: PropTypes.func.isRequired,
   handleSave: PropTypes.func.isRequired,
   postSave: PropTypes.func,
   postUrl: PropTypes.string,

 }

 Form.defaultProps = {
  postSave: function() { console.log("this was a postSave call")},
  handleDelete: function() { console.log("this was a delete call")},
 }


export default connect(mapStateToProps, mapDispatchToProps)(Form);