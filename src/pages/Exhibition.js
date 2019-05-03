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
    getExhibitionOptions: () => dispatch(actions.conf.getExhibitionOptions()),
  }
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    exhibitionOptions: state.conf.exhibitionOptions,
    event: state.auth.event.url,
  }
}



class Exhibition extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.loadData = this.loadData.bind(this);
    this.reload = this.reload.bind(this)
    this.state = {
      loading: false,
      exhibition: null,
      exhibitionPosten: null,
      modal: false,
    }
  }


  colors = getRandomColors(10);

  loadData() {
    axios.get(BASE_URL + 'exhibition', this.props.config).then(res => (
      this.setState({exhibition: res.data.results })
    ))
  }

  componentDidMount() {
    this.props.getExhibitionOptions();
    this.props.setTitle("Exhibition");
    this.loadData();
  }

  editData = exhibitionPosten => {
    console.log(exhibitionPosten);
    this.setState({ exhibitionPosten: exhibitionPosten, modal: true })
  }

  closeModal() {
    this.setState({ modal: false })
  }

  onChange = event => {
    let m = {...this.state.exhibitionPosten}
    m[event.target.name] = event.target.value
    this.setState({ exhibitionPosten: m })
  }

  reload() {
    this.loadData();
  }


  render() {
    return <div>
      <Button onClick={() => this.editData({url: BASE_URL+'exhibition/', id: 'new', event: this.props.event})}>New Exhibition</Button>
      { this.state.exhibition && <div><List>
          { this.state.exhibition.map((t, i) => (

              <ListItem key={t.id} url={t.url} button onClick={() => this.editData(t)}>
                  <Avatar style={{backgroundColor: this.colors[i % 10] }}>{t.name[0]}</Avatar>
                  <ListItemText primary={t.name}
                  secondary={"€ "+ t.price} />
              </ListItem>

            )) 
          }
        </List>
        { this.state.exhibitionPosten && 
          <FormModal open={this.state.modal} title="Edit Exhibition" handleClose={this.closeModal}>
            <Form values={this.state.exhibitionPosten}
              options={this.props.exhibitionOptions}
              handleCancel={this.closeModal}
              postUrl={this.state.exhibitionPosten.url}
              onChange={this.onChange} 
              postSave={this.reload} 
              handleDelete={this.reload} />          
          </FormModal>
        }
      </div>}
    </div>
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Exhibition));
