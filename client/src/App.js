import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';

import Game from './routes/Game';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={Header}/>
            <Route exact path='/game' component={Game}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;