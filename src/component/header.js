import React, { Component } from 'react';
import {Link} from 'react-router-dom'
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
          <div className="inner clearfix">
            <div className="logo">
              <Link to="/resource/resourceview">&nbsp;&nbsp;</Link>
            </div>
            <ul className="user-mes-box clearfix">
              <li className="admin-center-info">
                <a><span >{this.state.userName}</span><i className="iconfont"></i></a>
                <div className="dropdown-layer admin-center">
                  <ul className="admin-center-menu">
                    <li>
                      <a onClick={this.changPassword}><i className="icon-aw-gear"></i></a>
                    </li>
                    <li>
                      <a onClick={this.loginOut}><i className="icon-aw-shut-down"></i></a>
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
