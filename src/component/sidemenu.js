import React, { Component } from 'react';
import {Link,NavLink} from "react-router-dom";
import GLOBALDATA from '../config/globalSetting';



class SideMenu extends Component {
  constructor(){
    super();
    this.menuList = GLOBALDATA.ADMIN_MENU;
  }
  render() {
    let _menu = this.menuList.map((item,index)=>{
      return <Menu menu={item} keys={index} key={index}/>
    })
    return (
      <aside>
      <span className="toggle-icon">
        <i className="icon-aw-angle-double-right"></i>
      </span>
      <ul className="menu-level-1">
        {_menu}
      </ul>
    </aside>
    );
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps);
  }
  
}

class Menu extends Component{
  constructor(props){
    super(props);
    this.item = this.props.menu;
    let keyword = props.menu.keywords
    this.state = {
      keyword:false
    }
    this._toggle = this._toggle.bind(this);
  }
  _toggle(){
    let val = this.state.keyword;
    this.setState({
      keyword:!val
    })
  }
  componentDidMount() {
    console.log(this.props.onRouteEnter(this.props.match));
      //this.props.onRouteEnter(this.props.match); // 这里你可以根据需要传更多信息
  }
  render(){
    return(
        this.item.child.length>0?
          (
            <li className={"has-child "+(this.state.keyword?'level2-active':'')}>
              <a onClick={this._toggle}>
                <span><i className={this.item.icon}></i><b>{this.item.text}</b></span>
                <i className="icon-arrow"></i>
              </a>
              <SubMenu child={this.item.child}/>
            </li>
          ):
          (
            <li>
              <NavLink to={this.item.href}>
                <span><i className={this.item.icon}></i><b>{this.item.text}</b></span>
                <i className="icon-arrow"></i>
              </NavLink>
            </li>
          )
    )
  }
}

class SubMenu extends Component{
  constructor(props){
    super(props);
    this.subItem = this.props.child;
  }
  render(){
    return (
      <ul className="menu-level-2">
        {
          this.subItem.map((item,index)=>
            (
              <li key={index}>
              <NavLink to={item.href} activeClassName="sub-active">
                <span><i className="pointer"></i>{item.text}</span>
              </NavLink>
            </li>
            )
          )
        }
      </ul>
    )
  }
}



export default SideMenu;
