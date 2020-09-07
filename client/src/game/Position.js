import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const Position = ({nowPrice, buyPrice, stocks, gainPrice, gainPercent, winCount, loseCount, accGainPrice, account}) => {
    let style;
    if (gainPrice > 0) {
        style = {
            color: 'red'
        }
    } else if (gainPrice < 0) {
        style = {
            color: 'blue'
        }
    }

    let accStyle;
    if (accGainPrice > 0) {
        accStyle = {
            color: 'red'
        }
    } else if (accGainPrice < 0) {
        accStyle = {
            color: 'blue'
        }
    }

    return (
        <Div>
            <BoxHead>
                <span>포지션</span>
            </BoxHead>
            <BoxBody>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center" style={{padding: 10}}>현재가</TableCell>
                            <TableCell align="center" style={{padding: 10}}>매입가</TableCell>
                            <TableCell align="center" style={{padding: 10}}>수량</TableCell>
                            <TableCell align="center" style={{padding: 10}}>평가손익</TableCell>
                            <TableCell align="center" style={{padding: 10}}>수익률</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">{nowPrice.toLocaleString()}</TableCell>
                            <TableCell align="center">{buyPrice.toLocaleString()}</TableCell>
                            <TableCell align="center">{stocks.toLocaleString()}</TableCell>
                            <TableCell align="center" style={style}>{gainPrice.toLocaleString()}</TableCell>
                            <TableCell align="center" style={style}>{gainPercent}%</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} style={{borderBottom: 0}}/>
                            <TableCell align="left" style={{paddingBottom: 5}}>평가금액</TableCell>
                            <TableCell align="center" style={{paddingBottom: 5}}>{(nowPrice*stocks).toLocaleString()}원</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </BoxBody>
            <br />
            <BoxHead>
                <span>누적통계</span>
            </BoxHead>
            <BoxBody>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center" style={{padding: 10}}>승률</TableCell>
                            <TableCell align="center" style={{padding: 10}}>평가손익</TableCell>
                            <TableCell align="center" style={{padding: 10}}>수익률</TableCell>
                            <TableCell align="center" style={{padding: 10}}>추정자산</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">{isNaN((winCount/(winCount+loseCount)))?0:(winCount/(winCount+loseCount)*100).toFixed(2)}%</TableCell>
                            <TableCell align="center" style={accStyle}>{accGainPrice.toLocaleString()}</TableCell>
                            <TableCell align="center" style={accStyle}>{((((100000000+accGainPrice)/100000000)-1)*100).toFixed(2)}%</TableCell>
                            <TableCell align="center">{(account+nowPrice*stocks).toLocaleString()}원</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} style={{borderBottom: 0}}/>
                            <TableCell align="center" style={{paddingBottom: 5}}>잔고</TableCell>
                            <TableCell align="center" style={{paddingBottom: 5}}>{account.toLocaleString()}원</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </BoxBody>
        </Div>
    );
}

const Div = styled.div`
    margin-top: 30px;
    width: 91%;
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

export default Position;