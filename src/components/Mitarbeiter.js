import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions';
import * as helpers from '../common/helpers';
import {withRouter, Redirect} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import { BASE_URL } from '../common/constants';
import Form from '../components/Form';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormModal from '../components/FormModal';




const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMitarbeiterOptions: () => dispatch(actions.conf.getMitarbeiterOptions()),
  }
}


const mapStateToProps = (state) => {
  return {
    config: state.auth.config,
    mitarbeiterOptions: state.conf.mitarbeiterOptions,
    event: state.auth.event.url,
  }
}


class Mitarbeiter extends Component {
  constructor(props) {
    super(props);
    this.editData = this.editData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      mitarbeiter: {url: null },
      modal: false
    }
  }

  colors = helpers.getRandomColors(10);

  componentDidMount() {
    this.props.getMitarbeiterOptions();
  }

  editData = mitarbeiter => {
    console.log(mitarbeiter);
    this.setState({ mitarbeiter: mitarbeiter, modal: true })
  }

  onChange = event => {
    let m = {...this.state.mitarbeiter}
    m[event.target.name] = event.target.value
    this.setState({ mitarbeiter: m })
  }


  closeModal() {
    this.setState({ modal: false })
    this.props.reload();
  }

  render() {
    return <div>
        <Button onClick={() => this.editData({url: BASE_URL+'company/1/add_mitarbeiter/', id: 'new', event: this.props.event})}>New Mitarbeiter</Button>
        
        <List>
          {this.props.mitarbeiter.map((v, i) => (
            // <ListItem key={i} onClick={() => this.editData(v)}>{v.firstname} {v.lastname}</ListItem>
            <ListItem key={i} url={v.url} button onClick={() => this.editData(v)}>
              <Avatar style={{backgroundColor: this.colors[i % 10] }}>{v.firstname[0]}</Avatar>
              <ListItemText primary={v.firstname+' '+v.lastname}  />
          </ListItem>
          ))}
        </List>


         <FormModal open={this.state.modal} title="Edit Mitarbeiter" handleClose={this.closeModal}>
          <Form values={this.state.mitarbeiter}
                options={this.props.mitarbeiterOptions}
                handleCancel={this.closeModal}
                postUrl={this.state.mitarbeiter.url}
                onChange={this.onChange} 
                postSave={this.reload} 
                handleDelete={this.reload} />          
         </FormModal>
      </div>
  }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mitarbeiter));


//   constructor(props) {
//     super(props);
//     this.closeModal = this.closeModal.bind(this)
//     this.onChange = this.onChange.bind(this)

//     this.state = {
//       loading: true,
//       firma: null,
//       mitarbeiter: [],
//       modal: false,
//       showDetails: false,
//       activeTab: 1,
//     }
//   }


//   editData = mitarbeiter => {
//     console.log(mitarbeiter);
//     this.setState({ mitarbeiter: mitarbeiter, modal: true })
//   }

//   closeModal() {
//     this.setState({ modal: false })
//   }

//   onChange = event => {
//     let m = {...this.state.mitarbeiter}
//     m[event.target.name] = event.target.value
//     this.setState({ mitarbeiter: m })
//   }

//   reload() {
//     this.loadData();
//   }

//   handleTab = (event, value) => {
//     this.setState({ activeTab: value });
//   }

//   render() {
//     let c = this.state.mitarbeiter;
//     return <div>{this.state.loading ? <h3>Loading</h3> : <div>


//               <FormModal open={this.state.modal} title="Edit Mitarbeiter" handleClose={this.closeModal}>
//                 <Form values={this.state.mitarbeiter}
//                   options={this.props.mitarbeiterOptions}
//                   handleCancel={this.closeModal}
//                   postUrl={this.state.mitarbeiter.url}
//                   onChange={this.onChange} 
//                   postSave={this.reload} 
//                   handleDelete={this.reload} />          
//               </FormModal>
//           </div>}
//         </div>
//   }
// }

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mitarbeiter));
