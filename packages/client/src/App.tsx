import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router, Switch, Route, Link,
} from 'react-router-dom';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import store from './Store';

import './App.scss';

import ScrollToTop from './Components/ScrollToTop';
import Device from './Views/Device';
import Container from './Components/Container';
import Home from './Views/Home';
import Header from './Components/Header';

const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <ScrollToTop />
      <Header />
      <Container>
        <Switch>
          <Route path="/:key">
            <Device />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </Router>
  </Provider>
);

export default App;
