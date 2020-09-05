import React, {Component} from 'react';
import styled from "styled-components";
import Header from '../components/Header';
import Chart from '../game/Chart';
import Account from '../game/Account';

class Game extends Component {
    render() {
      return (
        <div>
            <Header />
            <Div style={{width: '50%', position: 'absolute', fontSize: 'small'}}>
                <Chart />
            </Div>
            <div style={{width: '26%', float: 'right', marginRight: '15%', position: 'relative', fontSize: 'small'}}>
                <Account />
            </div>
        </div>
      );
    }
}

const Div = styled.div`
    margin: 10px 15%;
`;

export default Game;