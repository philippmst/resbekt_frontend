import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';


const Loader = props => {
  return <div style={{ margin: 'auto', maxWidth:'500px'}}>
    <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Daten werden geladen</h2>
    <LinearProgress />
  </div>
}

export default Loader
