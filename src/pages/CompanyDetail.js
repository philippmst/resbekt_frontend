import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import {withRouter, Redirect} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import { BASE_URL } from '../common/constants';
import Form from '../components/Form';
import FormModal from '../components/FormModal';
import Mitarbeiter from '../components/Mitarbeiter';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}


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
    getOrderOptions: () => dispatch(actions.conf.getOrderOptions()),
  }
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    companyOptions: state.conf.companyOptions,
    event: state.auth.event.url,
  }
}



class CompaniesDetail extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.loadData = this.loadData.bind(this);
    this.reload = this.reload.bind(this)
    this.loadData = this.loadData.bind(this)

    this.state = {
      loading: true,
      firma: null,
      company: [],
      modal: false,
      showDetails: false,
      activeTab: 1,
    }
  }


  colors = getRandomColors(10);

  loadData(id) {
    axios.get(BASE_URL + 'company/'+id, this.props.config).then(res => (
      this.setState({ company: res.data, loading: false })
    ))
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.getCompanyOptions();
    this.props.setTitle("CompanyDetail");
    this.loadData(id);
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
    this.loadData(this.props.match.params.id);
  }

  handleTab = (event, value) => {
    this.setState({ activeTab: value });
  }

  render() {
    let c = this.state.company;
    return <div>{this.state.loading ? <h3>Loading</h3> : <div>
              <h3>{c.companyname}</h3>
              <h5>{c.contactname}</h5>
              <h5>{c.street} {c.plz}, {c.city} ({c.country})</h5>
              <div>
                <AppBar position="static" color="secondary" style={{marginTop: '50px', backgroundColor: ''}}>
                  <Tabs value={this.state.activeTab} onChange={this.handleTab}>
                    <Tab label="Fachmesse" />
                    <Tab label="Mitarbeiter" />
                    <Tab label="Rechnung" />
                  </Tabs>
                </AppBar>
                {this.state.activeTab === 0 && <TabContainer>Item One</TabContainer>}
                {this.state.activeTab === 1 && <TabContainer><Mitarbeiter mitarbeiter={c.mitarbeiter_set} reload={this.reload}/></TabContainer>}
                {this.state.activeTab === 2 && <TabContainer>Item Three</TabContainer>}
              </div>

              <FormModal open={this.state.modal} title="Edit Company" handleClose={this.closeModal}>
                <Form values={this.state.company}
                  options={this.props.companyOptions}
                  handleCancel={this.closeModal}
                  postUrl={this.state.company.url}
                  onChange={this.onChange} 
                  postSave={this.reload} 
                  handleDelete={this.reload} />          
              </FormModal>
          </div>}
        </div>
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompaniesDetail));
