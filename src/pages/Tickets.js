import React, { Component } from 'react';
import TableView from '../components/TableView';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import {Route, Link, Switch, BrowserRouter, Redirect, withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { nominalTypeHack } from 'prop-types';
import axios from 'axios';
import { BASE_URL } from '../common/constants';
import Form from '../components/Form';
import FormModal from '../components/FormModal';


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomColors(x) {
  let colors=[];
  for (let i = 0; i < x; i++) {
    colors.push(getRandomColor());
  }
  return colors;
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setTitle: (title) => dispatch(actions.base.setTitle(title)),
    getTicketOptions: () => dispatch(actions.conf.getTicketOptions()),
  }
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    ticketOptions: state.conf.ticketOptions,
    event: state.auth.event.url,
  }
}



class Tickets extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.loadData = this.loadData.bind(this);
    this.reload = this.reload.bind(this)
    this.state = {
      loading: false,
      tickets: null,
      ticket: [],
      modal: false,
    }
  }

  colors = getRandomColors(10);

  loadData() {
    axios.get(BASE_URL + 'ticket', this.props.config).then(res => (
      this.setState({tickets: res.data.results })
    ))
  }

  componentDidMount() {
    this.props.getTicketOptions();
    this.props.setTitle("Tickets");
    this.loadData();
  }

  editData = ticket => {
    console.log(ticket);
    this.setState({ ticket: ticket, modal: true })
  }

  closeModal() {
    this.setState({ modal: false })
  }

  onChange = event => {
    let m = {...this.state.ticket}
    m[event.target.name] = event.target.value
    this.setState({ ticket: m })
  }

  reload() {
    this.loadData();
  }


  render() {
    return <div style={{ marginTop: '20px'}}>
      <Button onClick={() => this.editData({url: BASE_URL+'ticket/', id: 'new', event: this.props.event})}>New Ticket</Button>
        <Paper style={{marginTop:'10px'}}>
          { this.state.tickets && <div><List>
            { this.state.tickets.map((t, i) => (

                <ListItem key={t.id} url={t.url} button onClick={() => this.editData(t)}>
                    <Avatar style={{backgroundColor: this.colors[i % 10] }}>{t.name[0]}</Avatar>
                    <ListItemText primary={t.name}
                    secondary={"€ "+ t.price} />
                </ListItem>

              )) 
            }
          </List>
            <FormModal open={this.state.modal} title="Edit Ticket" handleClose={this.closeModal}>
              <Form values={this.state.ticket}
                options={this.props.ticketOptions}
                handleCancel={this.closeModal}
                postUrl={this.state.ticket.url}
                onChange={this.onChange} 
                postSave={this.reload} 
                handleDelete={this.reload} />          
            </FormModal>
          </div>}

          <div style={{height: '200px', width: '200px', border: '1px solid black', margin:'40px'}}>
            <div style={{height: '40px', width: '90%', border: '1px solid black', marginLeft:'5%', marginTop:'-20px', backgroundColor: 'purple'}}>
            <h3 style={{color: 'white'}}>hello</h3>
            </div>      
          </div>
        }
    </Paper>
  </div>
}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tickets));
