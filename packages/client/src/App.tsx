import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router, Switch, Route, Link,
} from 'react-router-dom';
import moment from 'moment';

import store from './Store';

import './App.scss';

import ScrollToTop from './Components/ScrollToTop';
import Container from './Components/Container';
import Header from './Components/Header';

import Home from './Views/Home';
import Device from './Views/Device';
import Privacy from './Views/Privacy';

const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <ScrollToTop />
      <Header />
      <Container>
        <Switch>
          <Route path="/privacy">
            <Privacy />
          </Route>
          <Route path="/:key">
            <Device />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
        <footer className=" d-flex">
          &copy; Copyright {moment().format('YYYY')} Dave Flanagan
          <Link className="ms-auto" to="/privacy">Privacy Policy</Link>
        </footer>
      </Container>
    </Router>
  </Provider>
);

export default App;
