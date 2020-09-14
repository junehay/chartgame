import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import Looks3Icon from '@material-ui/icons/Looks3';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './RankList.css';

const columns = [
    { id: 'rank', label: '랭킹', minWidth: 30 },
    { id: 'name', label: '이름', minWidth: 100 },
    { id: 'company', label: '종목', minWidth: 100 },
    { id: 'vicPercent', label: '승률', minWidth: 50 },
    { id: 'gainPercent', label: '수익률', minWidth: 50 },
    { id: 'account', label: '잔고', minWidth: 80 }
];

function createData(rank, name, company, vicPercent, gainPercent, account) {
    if (rank === 1) {
        rank = <LooksOneIcon style={{color: 'gold'}}/>;
    } else if (rank === 2) {
        rank = <LooksTwoIcon style={{color: 'silver'}}/>;
    } else if (rank === 3) {
        rank = <Looks3Icon style={{color: 'brown'}}/>;
    }
    vicPercent = `${vicPercent}%`;
    gainPercent = `${gainPercent}%`;
    account = `${account.toLocaleString()}원`;

    return { rank, name, company, vicPercent, gainPercent, account };
}

const getRecordData = async () => {
    const rankList = await axios.get('/api/ranklist');
    const data = rankList.data;
    const formatData = data.map((e, index) => {
        return createData(index+1, e.name, e.company, e.vicPercent, e.gainPercent, e.account);
    })

    return formatData;
}

const RankList = () => {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        getRecordData()
            .then(res => {
                setRows(res);
            })
    }, []);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    return (
        <div>
            <List>
            <ListHead>
                <Typography variant="h6" style={{padding: '3px 5px 3px 16px', display: 'inline-block'}}>실시간 랭킹</Typography>
                <Typography variant="caption">(매주 월요일 오전 9시 초기화)</Typography>
            </ListHead>
             <Paper>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {columns.map((column) => (
                            <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                        return (
                            <TableRow hover key={index}>
                            {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                <TableCell key={column.id} align={column.align}>
                                    {value}
                                </TableCell>
                                );
                            })}
                            </TableRow>
                        );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>

            <StartBox>
                <Link to="/game" style={{padding: "10px 0px"}}><Button size="large" variant="outlined" color="primary">차트게임 시작!!!</Button></Link>
            </StartBox>
            </List>
        </div>
    );
};

const List = styled.div`
    margin: 0px auto;
    width: 620px;
    margin-top: 60px;
`;

const ListHead = styled.div`
    background-color: #93abff;
    width: 100%;
    border: 1px solid;
    border-color: #d2d2d2;
    color: white;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
`;

const StartBox = styled.div`
    margin-top: 20px;
    width: 100%;
    text-align: center;
`;

export default RankList;