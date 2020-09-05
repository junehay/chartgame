import React, {Component} from 'react';
import Header from '../components/Header';
import Chart from '../game/Chart';
import styled from "styled-components";

class Game extends Component {
    render() {
      return (
        <div>
            <Header />
            <Div>
                <Chart />
            </Div>
        </div>
      );
    }
}

const Div = styled.div`
    margin: 10px 15%;
`;

export default Game;