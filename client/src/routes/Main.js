import React from 'react';
import Header from '../components/Header';
import RankList from '../main/RankList';
import GroupChat from '../main/GroupChat';

const Main = () => {
  return (
    <div>
      <Header />
      <RankList />
      <GroupChat />
    </div>
  );
};

export default Main;