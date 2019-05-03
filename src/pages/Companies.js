import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import {withRouter, Redirect} from 'react-router-dom';
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
    getCompanyOptions: () => dispatch(actions.conf.getCompanyOptions()),
  }
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    companyOptions: state.conf.companyOptions,
    event: state.auth.event.url,
  }
}



class Companies extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.loadData = this.loadData.bind(this);
    this.reload = this.reload.bind(this)
    this.showDetails = this.showDetails.bind(this);

    this.state = {
      loading: false,
      companies: null,
      company: null,
      firma: null,
      modal: false,
      showDetails: false,
    }
  }


  colors = getRandomColors(10);

  loadData() {
    axios.get(BASE_URL + 'company', this.props.config).then(res => (
      this.setState({companies: res.data.results })
    ))
  }

  componentDidMount() {
    this.props.getCompanyOptions();
    this.props.setTitle("Company");
    this.loadData();
  }

  editData = company => {
    console.log(company);
    this.setState({ company: company, modal: true })
  }

  closeModal() {
    this.setState({ modal: false })
  }

  onChange = event => {
    let m = {...this.state.company}
    m[event.target.name] = event.target.value
    this.setState({ company: m })
  }

  reload() {
    this.loadData();
  }

  showDetails = t => {
    return <Redirect to={"/company/" + t.id} />
  }


  render() {
    return <div>
      <Button onClick={() => this.editData({url: BASE_URL+'company/', id: 'new', event: this.props.event})}>New Company</Button>
      { this.state.companies && <div><List>
          { this.state.companies.map((t, i) => (

              <ListItem key={t.id} url={t.url} button onClick={() => this.showDetails(t)}>
                  <Avatar style={{backgroundColor: this.colors[i % 10] }}>{t.companyname[0]}</Avatar>
                  <ListItemText primary={t.companyname}
                  secondary={`${t.street}, ${t.plz} ${t.city}, ${t.country}`} />
              </ListItem>

            )) 
          }
        </List>
        { this.state.company && 
          <FormModal open={this.state.modal} title="Edit Company" handleClose={this.closeModal}>
            <Form values={this.state.company}
              options={this.props.companyOptions}
              handleCancel={this.closeModal}
              postUrl={this.state.company.url}
              onChange={this.onChange} 
              postSave={this.reload} 
              handleDelete={this.reload} />          
          </FormModal>
        }
      </div>}
    </div>
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Companies));
