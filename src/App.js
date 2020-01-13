import React, {Component} from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';

import Login from './views/login/';
import Admin from './views/admin/';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/" component={Admin}/>

        </Switch>
      </HashRouter>
    );
  }
}

export default App;
