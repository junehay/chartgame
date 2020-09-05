import React from 'react';
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as Api from "./CallApi";


const Account = () => {
    return (
        <Div>
            <BoxHead>
                <span>잔고</span>
            </BoxHead>
            <BoxBody>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell align="center" style={{padding: 10}}>현재가</TableCell>
                        <TableCell align="center" style={{padding: 10}}>매입가</TableCell>
                        <TableCell align="center" style={{padding: 10}}>평가손익</TableCell>
                        <TableCell align="center" style={{padding: 10}}>수익률</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">50,000</TableCell>
                            <TableCell align="center">30,000</TableCell>
                            <TableCell align="center">+10,000</TableCell>
                            <TableCell align="center">+15.5%</TableCell>
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
                    <TableHead>
                    <TableRow>
                        <TableCell align="center" style={{padding: 10}}>승률</TableCell>
                        <TableCell align="center" style={{padding: 10}}>평가손익</TableCell>
                        <TableCell align="center" style={{padding: 10}}>수익률</TableCell>
                        <TableCell align="center" style={{padding: 10}}>잔고</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">61.5%</TableCell>
                            <TableCell align="center">+30,000</TableCell>
                            <TableCell align="center">+10%</TableCell>
                            <TableCell align="center">100,000,000원</TableCell>
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

export default Account;