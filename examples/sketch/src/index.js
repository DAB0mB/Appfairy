import './index.css';
import loadingScripts from './scripts';
import loadingStyles from './styles';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HomeView from './views/HomeView';
import registerServiceWorker from './registerServiceWorker';
import HomeController from './controllers/HomeController'
import CowController from './controllers/CowController'
import DrinkController from './controllers/DrinkController'
import ProjectController from './controllers/ProjectpageController'

Promise.all([
  loadingScripts,
  loadingStyles,
]).then(() => {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomeController} />
        <Route exact path="/cow" component={CowController} />
        <Route exact path="/drink" component={DrinkController} />
        <Route exact path="/project" component={ProjectController} />
      </Switch>
    </BrowserRouter>
  , document.getElementById('root'));
  registerServiceWorker();
})
