import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupChat.css';
import io from 'socket.io-client';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const socket = io('localhost:3001');

socket.on('update', (data) => {
  let chat = document.getElementById('chat');
  let message = document.createElement('div');
  let msgDiv = document.createElement('div');
  msgDiv.classList.add('msgDiv');
  let node = document.createTextNode(`${data.message}`);
  let name = document.createTextNode(`${data.name}`);
  let className = '';

  switch (data.type) {
    case 'message':
      className = 'other';
      let p = document.createElement('p');
      p.classList.add('name');
      p.appendChild(name);
      let br = document.createElement('br');
      msgDiv.appendChild(p);
      msgDiv.appendChild(br);
      break;

    case 'connect':
      className = 'connect';
      break;

    case 'disconnect':
      className = 'disconnect';
      break;
  }

  message.classList.add(className);
  message.appendChild(node);

  msgDiv.appendChild(message);
  const scrollChk = chat.clientHeight + chat.scrollTop >= chat.scrollHeight;
  chat.appendChild(msgDiv);
  if (scrollChk) {
    chat.scrollTop = chat.scrollHeight;
  }
})

const send = () => {
  let message = document.getElementById('text').value;
  if (message) {
    document.getElementById('text').value = '';
  
    let chat = document.getElementById('chat');
    let msgDiv = document.createElement('div');
    let msg = document.createElement('div');
    let node = document.createTextNode(message);
    msg.classList.add('me');
    msgDiv.classList.add('msgDiv');
    msgDiv.appendChild(msg);
    msg.appendChild(node);
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
  
    socket.emit('message', {
      type: 'message',
      message: message
    })
  } else {
    alert('메시지를 입력해주세요.');
  }
}

const enterKey = () => {
  if (window.event.keyCode == 13) {
    send();
  }
};


const GroupChat = () => {
  const [numUsers, setNumUsers] = useState(socket.numUsers);
  const [userName, setUserName] = useState();

  socket.on('connect', async () => {
    const id = await axios.post('/api/id');
    const name = id.data.substr(0,6);
    setUserName(name);
    socket.emit('newUser', name);
  });

  useEffect(() => {
    socket.on('numUsers', (num) => {
      setNumUsers(num);
    });

    return () => {
      socket.off('connect');
      socket.off('numUsers');
    };
  });

  return (
    <Paper id="main">
        <Head>
          <Typography variant="h6" style={{padding: '3px 5px 3px 16px', display: 'inline-block'}}>실시간 채팅</Typography>
          <Typography variant="caption">(현재 접속자 : {numUsers})</Typography>
        </Head>
        <div id="chat">
        </div>
        <Paper id="foot">
          <Name>ID : {userName}</Name>
          <Input type="text" id="text" placeholder="메시지를 입력해주세요" onKeyPress={enterKey} style={{width: '67%', marginRight: '20px'}}/>
          <Button variant="outlined" size="small" onClick={send}>전송</Button>
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

export default GroupChat;
