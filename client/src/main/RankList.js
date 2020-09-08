import React from 'react';
import { Link } from 'react-router-dom';
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
    { id: 'name', label: '랭킹', minWidth: 30 },
    { id: 'code', label: '이름', minWidth: 80 },
    { id: 'code', label: '종목', minWidth: 80 },
    {
      id: 'population',
      label: '승률',
      minWidth: 70,
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'size',
      label: '수익률',
      minWidth: 70,
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'density',
      label: '잔고',
      minWidth: 100,
      format: (value) => value.toFixed(2),
    },
];
  
function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}
  
const rows = [
    createData(<LooksOneIcon style={{color: 'gold'}}/>, '카카오 폴리페놀', 13.33, 53.33),
    createData(<LooksTwoIcon style={{color: 'silver'}}/>, 'CN', 140365, 9561),
    createData(<Looks3Icon style={{color: 'brown'}}/>, 'IT', 604873, 301340),
    createData('4', 'US', 327434, 9833520),
    createData('5', 'CA', 37603, 99870),
    createData('6', 'AU', 25400, 92024),
    createData('7', 'DE', 83000, 3578),
    createData('8', 'IE', 4850, 702),
    createData('9', 'MX', 126591, 19550),
    createData('10', 'JP', 126310, 3773),
    createData('11', 'FR', 67020, 6409),
    createData('12', 'GB', 67545757, 242495)
];

const RankList = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
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
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number' ? column.format(value) : value}
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
    width: 600px;
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
    text-align: center
`;

export default RankList;