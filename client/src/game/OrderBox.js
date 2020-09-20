import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress'
import * as Api from './CallApi';
import GameResult from './GameResult';

const reset = async () => {
    const chk = window.confirm('초기화 하시겠습니까?');
    if(chk){
        await axios.post('/api/gameset');
        document.location.replace('/game');
    }
};

const OrderBox = ({drawChart, buy, sell, nextButton}) => {
    const [time, setTime] = useState(30);
    const [orderButton, setOrderButton] = useState(<Button size="small" variant="outlined"><CircularProgress size={25} /></Button>);

    useEffect(() => {
        Api.getDataLength()
            .then((res) => {
                setTime(res-50);
            })
    }, []);

    useEffect(() => {
        setTimeout(function () {
            if (nextButton === 'buy') {
                setOrderButton(<Button size="small" variant="contained" color="primary" onClick={buyClick}>Buy</Button>);
            } else if ((nextButton === 'sell')) {
                setOrderButton(<Button size="small" variant="outlined" color="primary" onClick={sellClick}>Sell</Button>);
            }
        }, 1000);
    }, [nextButton]);

    const passClick = () => {
        Api.shiftData()
            .then((res) => {
                if(res === 'end'){
                    alert('게임이 종료되었습니다.\nEND GAME 버튼을 눌러 결과를 확인하세요.');
                }else{
                    drawChart();
                    setTime(time => time-1);
                }
            })
            .catch((err) => {
                console.log('err : ', err)
            });
    };

    const buyClick = async () => {
        if(time > 0){
            setOrderButton(<Button size="small" variant="outlined"><CircularProgress size={25} /></Button>);
            await buy();
            passClick();
        }else{
            alert('게임이 종료되었습니다.\nEND GAME 버튼을 눌러 결과를 확인하세요.');
        }
    }

    const sellClick = async () => {
        setOrderButton(<Button size="small" variant="outlined"><CircularProgress size={25} /></Button>);
        await sell();
        if(time > 0){
            passClick();
        }
    }

    return (
        <Div>
            <BoxHead>
                <span>주문</span><span style={{fontSize: 'smaller'}}> (남은횟수 : {time})</span>
            </BoxHead>
            <BoxBody>
                <Button size="small" variant="outlined" style={{marginRight: '20px'}} onClick={passClick}>Pass</Button>
                {orderButton}
                {time === 0 ? '' : <Button size="small" variant="outlined" style={{float: 'right'}}  onClick={reset}>Reset</Button>}
                <GameResult nextButton={nextButton} time={time}/>
            </BoxBody>
        </Div>
    );
}

const Div = styled.div`
    margin-top: 30px;
    width: 70%;
`;

const BoxHead = styled.div`
    width: 100%;
    background-color: #cad6ff;
    padding: 10px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid transparent;
`;

const BoxBody = styled.div`
    width: 100%;
    padding: 10px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px solid;
    border-color: #b7b7b7;
    display="inline";
`;

export default OrderBox;