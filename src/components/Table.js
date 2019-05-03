import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'store/actions';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Row, Col } from 'reactstrap';
import { Datum } from 'common/helpers';
 
 
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadKGs: (title) => dispatch(actions.base.loadKGs(title)),
  }
}

const mapStateToProps = (state) => {
  return {
    kgs: state.base.kgs,
  }
}

 
class BevTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: true,
      order: 'desc',
      orderBy: this.props.columns[0].name,
      filterByName: '',
      data: null,
      rowsPerPage: 10,
      offset: 0,
      page: 0,
      switch: true,
      resultNums: 0,
    }
  }
 
  getData() {
    let url = this.props.url
    console.log("url")
    console.log(url)
    if (this.props.location.search) { url += this.props.location.search + '&'} else { url+='?'}
    url+='limit='+this.state.rowsPerPage
    url+='&offset='+this.state.offset;
    url += '&ordering='
    if (this.state.order === 'desc') { url+='-'}
    url += this.state.orderBy;
    if (this.state.filterByName) { url += '&'+this.props.searchFieldName+'='+this.state.filterByName}
    if (this.state.switch) { url += '&'+this.props.switchUrl}
    axios.get(url, this.props.config).then(res => {
      this.setState({ data: res.data.results, resultNums: res.data.count });
      console.log(res.data.results)
    })
  }
 
  componentDidMount() {
    this.getData();
  }
 
  handleSort = property => event => {
    let ord = 'desc'
    if (this.state.orderBy === property) {
         ord = (this.state.order == 'asc' ? 'desc' : 'asc')
    }
    this.setState({ orderBy: property, order: ord}, this.getData )
  }
 
  changeName = event => {
    this.setState({ filterByName: event.target.value });
  }
 
  handleChangePage = (event, page) => {
    this.setState({page: page, offset: this.state.rowsPerPage*page }, this.getData );
  }
 
  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value }, this.getData );
  }
 
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.getData()
    }
  }

  setSwitchBack = (url) => {
    axios.get(url+'set_bezahlt/', this.props.config).then(res => {
      toast.success(res.data.mname + ' hat bezahlt');
      this.getData();
    })
  }
 
 
  render() {
    return <Container>
      <Row>
        <Col>
          { this.props.showNewButton && <Button style={{marginTop: '20px', marginBottom: '20px'}} variant="contained" color="secondary" onClick={this.props.new}>{this.props.newText}</Button> }
          
          { 
            this.props.switchButton && <FormControlLabel
            style={{ marginLeft: '30px' }}
              control={ <Switch checked={this.state.switch} onChange={() => this.setState({switch: !this.state.switch}, this.getData )} />}
              label={this.props.switchText} />
          }
 

        </Col>
        <Col xs={12}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  {this.props.columns.map( col => (
                    <TableCell>
                      <Tooltip title="Sort" placement={'bottom-start'} enterDelay={300}>
                        <TableSortLabel active={col.name === this.state.orderBy} direction={this.state.order} onClick={this.handleSort(col.name)}>
                          {col.name}
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
 
              <TableBody>
                { this.state.data && (this.state.data.map((row, ii) => (
                    <TableRow key={ii} style={{cursor: 'pointer' }} component={Link} to={'/punkte/'+row.id} >
                        {this.props.columns.map((v,i) => {
                          if (v.hasOwnProperty("type")) {
                            if (v.type === 'date') {
                              return <TableCell key={i} align={row[v.align]}><Datum date={row[v.name]} /></TableCell>
                            }
                          }
                          if (v.name === 'kg') {
                            return <TableCell key={i} align={row[v.align]}>{this.props.kgs.filter(kg => kg.value === row[v.name])[0].label}</TableCell>
                          } else {
                            return <TableCell key={i} align={row[v.align]}>{row[v.name]}</TableCell>
                          }
                        })}
                    </TableRow>
                )))
                }
              </TableBody>
            </Table>
            <TablePagination rowsPerPageOptions={[10, 20, 50]} component="div" count={this.state.resultNums} rowsPerPage={this.state.rowsPerPage} page={this.state.page}
              backIconButtonProps={{ 'aria-label': 'Previous Page', }}
              nextIconButtonProps={{ 'aria-label': 'Next Page', }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
 
          </Paper>
        </Col>
        </Row>
      </Container>
  }
}
 

BevTable.defaultProps = {
  switchButton: false, //soll der switchbutton angezeigt werden
  switchText: 'aktive', // der Text neben dem SwitchButton
  switchUrl: 'aktiv=True', // die Url die durch den SwitchButton angepasst wird
  deleteField: 'aktiv', // das Attribut das steuert ob die Row inaktiv angezeigt wird
  detailFunction: false,
  showNewButton: true,
}

export default connect(mapStateToProps, mapDispatchToProps)(BevTable);