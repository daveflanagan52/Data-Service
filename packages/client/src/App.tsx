import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import store from './Store';

import './App.scss';

import ScrollToTop from './Components/ScrollToTop';
import Device from './Views/Device';
import Container from './Components/Container';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark mb-4'>
          <div className='container'>
            <span className='navbar-brand'>
              <FontAwesomeIcon className='me-2 text-primary' icon={faDatabase} />
              Data Service
            </span>
          </div>
        </nav>
        <Container>
          <Switch>
            <Route path='/:key'>
              <Device />
            </Route>
          </Switch>
        </Container>
      </Router>
    </Provider>
  );
}

export default App;
