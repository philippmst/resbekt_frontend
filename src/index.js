import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import resStore from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { colors } from 'common/constants';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.red,
      light: 'white',
      dark: 'red',
      contrastText: '#fff',
      text: 'white',
    },
    secondary: {
      main: colors.grey,
      light: 'purple',
      dark: 'black',
      contrastText: 'cyan',
    },
  },
})



const app = (
    <Provider store={resStore}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
)


ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
