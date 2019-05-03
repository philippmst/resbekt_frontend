import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import {withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
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
    getActivitiesOptions: () => dispatch(actions.conf.getActivitiesOptions()),
  }
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    activitiesOptions: state.conf.activitiesOptions,
    event: state.auth.event.url,
  }
}



class Activities extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.loadData = this.loadData.bind(this);
    this.reload = this.reload.bind(this)
    this.state = {
      loading: false,
      activities: null,
      activity: null,
      modal: false,
    }
  }

  colors = getRandomColors(10);

  loadData() {
    axios.get(BASE_URL + 'activities', this.props.config).then(res => (
      this.setState({activities: res.data.results })
    ))
  }

  componentDidMount() {
    this.props.getActivitiesOptions();
    this.props.setTitle("Activities");
    this.loadData();
  }

  editData = activity => {
    console.log(activity);
    this.setState({ activity: activity, modal: true })
  }

  closeModal() {
    this.setState({ modal: false })
  }

  onChange = event => {
    let m = {...this.state.activity}
    m[event.target.name] = event.target.value
    this.setState({ activity: m })
  }

  reload() {
    this.loadData();
  }


  render() {
    return <div>
      <Button onClick={() => this.editData({url: BASE_URL+'activities/', id: 'new', event: this.props.event})}>New Activity</Button>
      { this.state.activities && <div><List>
          { this.state.activities.map((t, i) => (

              <ListItem key={t.id} url={t.url} button onClick={() => this.editData(t)}>
                  <Avatar style={{backgroundColor: this.colors[i % 10] }}>{t.name[0]}</Avatar>
                  <ListItemText primary={t.name}
                  secondary={"€ "+ t.price} />
              </ListItem>

            )) 
          }
        </List>
        { this.state.activity && 
          <FormModal open={this.state.modal} title="Edit Activities" handleClose={this.closeModal}>
            <Form values={this.state.activity}
              options={this.props.activitiesOptions}
              handleCancel={this.closeModal}
              postUrl={this.state.activity.url}
              onChange={this.onChange} 
              postSave={this.reload} 
              handleDelete={this.reload} />          
          </FormModal>
        }
      </div>}
    </div>
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Activities));
