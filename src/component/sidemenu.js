import React, { Component } from 'react';
import {Link} from "react-router-dom";
import GLOBALDATA from '../config/globalSetting';



class SideMenu extends Component {
  constructor(){
    super();
    this.menuList = GLOBALDATA.ADMIN_MENU;
  }
  render() {
    let _menu = this.menuList.map(item=>{
      return <Menu menu={item}/>
    })
    return (
      <aside toggle-nav>
      <span class="toggle-icon">
        <i class="icon-aw-angle-double-right"></i>
      </span>
      <ul class="menu-level-1">
        {_menu}
      </ul>
    </aside>
    );
  }
  
}

class Menu extends Component{
  constructor(props){
    super(props);
    
    this.item = this.props.menu;
  }
  render(){
    console.log(this);
    return(
      <li>
        <Link to={this.item.href}>
          <span><i class={this.item.icon}></i><b>{this.item.text}</b></span>
          <i class="icon-arrow"></i>
        </Link>
        { this.item.child.length>0?
          <SubMenu child={this.item.child}/>:""
        }
      </li>
    )
  }
}

class SubMenu extends Component{
  constructor(props){
    super(props);
    this.subItem = this.props.child;
    console.log(this);
  }
  render(){
    return (
      <ul className="menu-level-2">
        {
          this.subItem.map(item=>
            (
              <li>
              <Link to={item.href}>
                <span><i className="pointer"></i>{item.text}</span>
              </Link>
            </li>
            )
          )
        }
      </ul>
    )
  }
}



export default SideMenu;
