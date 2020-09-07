import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Main from './routes/Main';
import Game from './routes/Game';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={Main}/>
            <Route exact path='/game' component={Game}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;