import React, {Component} from 'react';
import styled from "styled-components";
import Header from '../components/Header';
import Chart from '../game/Chart';

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