import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import MaterialTable from 'material-table';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import nameToCode from '../nameToCode.json';


function createData(code, name, rows, createdAt) {
  createdAt = dayjs(createdAt).format('YYYY-MM-DD');

  return { code, name, rows, createdAt };
}

const getCompanyData = async () => {
  const companyData = await axios.post('/api/admin/company');
  const data = companyData.data;
  const formatData = data.map((e, index) => {
    return createData(e.code, e.name, e.rows, e.createdAt);
  })

  return formatData;
}

const deleteData = async (code) => {
  const res = await axios.post('/api/admin/company/del', {code: code});
  return res.data;
}

export default function MaterialTableDemo() {
  const [rows, setRows] = useState([]);
  const [companyCode, setCompanyCode] = useState('');

  const codeInput = useRef();
  const nameInput = useRef();

  useEffect(() => {
    getCompanyData()
      .then(res => {
        setRows(res);
      })
  }, []);

  const addData = async () => {
    const code = codeInput.current.firstChild.value;
    const name = nameInput.current.firstChild.value;
    if (!code) {
      alert('입력값이 잘못되었습니다.')
    } else {
      const add = await axios.post('/api/admin/company/add', {code: code, name: name});
      if (add.data === 'ADD') {
        alert(`${name} 추가 완료!`);
        const data = await getCompanyData();
        setRows(data);
      } else {
        alert('오류가 발생하였습니다.')
      }
      nameInput.current.firstChild.value = '';
    }
  }

  const nameChange = (e) => {
    const v = e.target.value;
    if (nameToCode[v]) {
      setCompanyCode(nameToCode[v]);
    } else {
      setCompanyCode('');
    }
  }

  const columns = [
    { title: 'code', field: 'code' },
    { title: 'name', field: 'name' },
    { title: 'rows', field: 'rows' },
    { title: 'createdAt', field: 'createdAt' }
  ];

  return (
    <>
      <MaterialTable
        title="게임 종목 관리"
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
                deleteData(oldData.code)
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
        <Input ref={nameInput} placeholder='종목명' onChange={nameChange}/>
        <Input ref={codeInput} placeholder='종목코드' value={companyCode} disabled/>
        <Button variant="outlined" color="primary" onClick={addData}>추가하기</Button>
      </Paper>
    </>
  );
}