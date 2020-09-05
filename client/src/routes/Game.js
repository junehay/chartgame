import React, {Component} from 'react';
import Chart from '../game/Chart';
import Header from '../components/Header';

class Game extends Component {
    render() {
      return (
        <div>
            <Header />
            <Chart />
        </div>
      );
    }

  }

export default Game;