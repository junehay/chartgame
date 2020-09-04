import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render(){
    return (
      <div>
        <Link to="/">홈</Link>
        <Link to="/game">게임</Link>
      </div>
    );
  }
}

export default Header;