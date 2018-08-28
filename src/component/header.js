import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './App.css';
//import axios from 'axios';



class Header extends Component {
  constructor(){
    super();
    this.state = {
      userName:'admin',
      newValue:""
    };
    this.changPassword = this.changPassword.bind(this);
    this.loginOut = this.loginOut.bind(this);
  }
  render() {
    return (
      <header>
        <div>
          <div class="inner clearfix">
            <div class="logo">
              <Link to="/resource/resourceview">&nbsp;&nbsp;</Link>
            </div>
            <ul class="user-mes-box clearfix">
              <li class="admin-center-info">
                <a><span >{userName}</span><i class="iconfont"></i></a>
                <div class="dropdown-layer admin-center">
                  <ul class="admin-center-menu">
                    <li>
                      <a onClick={this.changPassword}><i class="icon-aw-gear"></i></a>
                    </li>
                    <li>
                      <a onClick={this.loginOut}><i class="icon-aw-shut-down"></i></a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  }
  changPassword(e){
    console.log('password');
  };
  loginOut(val){
    console.log('loginOut');
  }
}



export default Header;
