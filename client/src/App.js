import React from 'react';
import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Main from './routes/Main';
import Game from './routes/Game';
import Admin from './routes/Admin';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={Main}/>
            <Route exact path='/game' component={Game}/>
            <Route exact path='/admin' component={Admin}/>
            <Route><Redirect to='/'/></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;