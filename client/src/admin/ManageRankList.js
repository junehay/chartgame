import React, {useState, useEffect} from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import Looks3Icon from '@material-ui/icons/Looks3';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';


function createData(_id, rank, name, company, vicPercent, gainPercent, account) {
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

    return { _id, rank, name, company, vicPercent, gainPercent, account };
}

const getRecordData = async () => {
    const rankList = await axios.get('/api/ranklist');
    const data = rankList.data;
    const formatData = data.map((e, index) => {
        return createData(e._id, index+1, e.name, e.company, e.vicPercent, e.gainPercent, e.account);
    })

    return formatData;
}

const deleteData = async (_id) => {
  const res = await axios.post('/api/admin/record/del', {_id: _id});
  return res.data;
}

const deleteDataAll = async () => {
  const chk = window.confirm('모든 랭킹 기록을 삭제하시겠습니까?');
  if (chk) {
    const res = await axios.post('/api/admin/record/del', {all: true});
    document.location.reload('/admin');
  }
}

export default function MaterialTableDemo() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        getRecordData()
            .then(res => {
                setRows(res);
            })
    }, []);
    const columns = [
        { title: '랭킹', field: 'rank' },
        { title: '이름', field: 'name' },
        { title: '종목', field: 'company' },
        { title: '승률', field: 'vicPercent' },
        { title: '수익률', field: 'gainPercent' },
        { title: '잔고', field: 'account' }
    ];

  return (
    <>
      <MaterialTable
        title="실시간 랭킹 관리"
        columns={columns}
        data={rows}
        options={{
          pageSize: 10,
          pageSizeOptions: [10]
        }}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                deleteData(oldData._id);
                setRows((prevRows) => {
                  const data = [...prevRows];
                  data.splice(data.indexOf(oldData), 1);
                  return data
                })
              }, 600);
            }),
        }}
      />
      <Paper style={{padding: '16px', display: 'flex'}}>
        <span style={{marginTop: '7px'}}>매주 오전 9시 node-schedule 작동중 ....</span>
        <Button size="small" variant="outlined" color="secondary" onClick={deleteDataAll}>지금 모두 삭제</Button>
      </Paper>
    </>
  );
}