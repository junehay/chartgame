import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import * as Api from "./CallApi";


const OrderBox = ({drawChart, buy, sell, nextButton}) => {
    const [time, setTime] = useState(30);

    useEffect(() => {
        Api.getDataLength()
            .then((res) => {
                setTime(res-50);
            })
    }, []);

    const passClick = () => {
        Api.shiftData()
            .then((res) => {
                if(!res){

                }else{
                    drawChart();
                    setTime(time => time-1);
                }
            })
    };

    const buyClick = () => {
        if(time > 0){
            buy();
            passClick();
        }
    }

    const sellClick = () => {
        sell();
        passClick();
    }

    let toggleButton;
    if(nextButton === 'buy'){
        toggleButton = <Button size="small" variant="contained" color="primary" onClick={buyClick}>Buy</Button>
    }else{
        toggleButton = <Button size="small" variant="outlined" color="primary" onClick={sellClick}>Sell</Button>
    }

    return (
        <Div>
            <BoxHead>
                <span>주문</span><span style={{fontSize: 'smaller'}}> (남은횟수 : {time})</span>
            </BoxHead>
            <BoxBody>
                <Button size="small" variant="contained" style={{marginRight: '30px'}}onClick={passClick}>
                    Pass
                </Button>
                {toggleButton}
                <Button size="small" variant="outlined" style={{float: 'right'}}>
                    End Game
                </Button>
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