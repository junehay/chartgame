import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import * as Api from "./CallApi";


const OrderBox = ({stateRefresh}) => {
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
                    stateRefresh();
                    setTime(time-1);
                }
            })
    };

    return (
        <Div>
            <BoxHead>
                <span>주문</span><span style={{fontSize: 'smaller'}}> (남은횟수 : {time})</span>
            </BoxHead>
            <BoxBody>
                <Button size="small" variant="contained" onClick={passClick}>
                    Pass
                </Button>
                <Button size="small" variant="contained" color="primary">
                    Buy
                </Button>
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