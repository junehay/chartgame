import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GroupChat.css';
import io from 'socket.io-client';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { useRecoilState } from 'recoil';
import { chatState, socketNumState } from '../store';

const socket = io(`${process.env.REACT_APP_HOST}`);

socket.on('connect', async () => {
  try {
    const name = await getName();
    socket.emit('newUser', name);
  } catch (err) {
    console.log('err : ', err);
  }
});

const getName = async () => {
  const id = await axios.get('/api/id');
  const name = id.data.substr(0, 6);
  return name;
};

const GroupChat = () => {
  const [socketNum, setsocketNum] = useRecoilState(socketNumState);
  const [userName, setUserName] = useState();
  const [chat, setChat] = useRecoilState(chatState);
  const chatDiv = useRef();
  const msgInput = useRef();
  useEffect(() => {
    getName().then((name) => {
      setUserName(name);
    });

    socket.on('socketNum', (num) => {
      setsocketNum(num);
    });

    socket.on('update', (data) => {
      switch (data.type) {
        case 'message':
          setChat((chat) => (
            <>
              {chat}
              <div className="msgDiv">
                <p className="name">{data.name}</p>
                <br />
                <div className="other">{data.message}</div>
              </div>
            </>
          ));
          break;

        case 'connect':
          setChat((chat) => (
            <>
              {chat}
              <div className="msgDiv">
                <div className="connect">{data.message}</div>
              </div>
            </>
          ));
          break;

        case 'disconnect':
          setChat((chat) => (
            <>
              {chat}
              <div className="msgDiv">
                <div className="disconnect">{data.message}</div>
              </div>
            </>
          ));
          break;
      }
      const chatBox = chatDiv.current;
      const scrollChk = chatBox.clientHeight + chatBox.scrollTop >= chatBox.scrollHeight;
      if (scrollChk) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    });
    return () => {
      socket.off('update');
      socket.off('socketNum');
    };
  }, []);

  const send = () => {
    let msg = msgInput.current.firstChild.value;
    if (msg) {
      setChat((chat) => (
        <>
          {chat}
          <div className="msgDiv">
            <div className="me">{msg}</div>
          </div>
        </>
      ));
      socket.emit('message', {
        type: 'message',
        message: msg
      });
      chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
      msgInput.current.firstChild.value = '';
    } else {
      alert('메시지를 입력해주세요.');
    }
  };

  const enterKey = (e) => {
    if (e.key === 'Enter') {
      send();
    }
  };

  return (
    <Paper className="main">
      <Head>
        <Typography variant="h6" style={{ padding: '3px 5px 3px 16px', display: 'inline-block' }}>
          실시간 채팅
        </Typography>
        <Typography variant="caption">(현재 접속자 : {socketNum})</Typography>
      </Head>

      <ChatArea ref={chatDiv}>{chat}</ChatArea>

      <Paper style={{ padding: '5px 16px' }}>
        <Name>ID : {userName}</Name>
        <Input ref={msgInput} type="text" placeholder="메시지를 입력해주세요" onKeyPress={enterKey} style={{ width: '67%', marginRight: '20px' }} />
        <Button variant="outlined" size="small" onClick={send}>
          전송
        </Button>
      </Paper>
    </Paper>
  );
};

const Head = styled.div`
  background-color: #93abff;
  width: 100%;
  border: 1px solid;
  border-color: #d2d2d2;
  color: white;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  text-align: left;
`;

const Name = styled.span`
  background-color: #e6e6e6;
  padding: 5px;
  font-size: 13px;
  margin-top: 2px;
  float: left;
`;

const ChatArea = styled.div`
  padding-top: 10px;
  height: 90%;
  width: 100%;
  overflow-y: auto;
  border: 1px solid #fff;
`;

export default GroupChat;
