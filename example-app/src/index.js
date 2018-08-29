import './index.css';
import './styles'
import './scripts'

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import IndexController from './controllers/IndexController'
import ThankYouController from './controllers/ThankYouController'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={IndexController} />
      <Route exact path="/thank-you" component={ThankYouController} />
    </Switch>
  </BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
