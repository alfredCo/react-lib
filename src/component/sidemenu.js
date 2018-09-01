import React, { Component } from 'react';
import {Link,NavLink,Prompt} from "react-router-dom";
import GLOBALDATA from '../config/globalSetting';



class SideMenu extends Component {
  constructor(){
    super();
    this.menuList = GLOBALDATA.ADMIN_MENU;
    this._change = this._change.bind(this);
    this.state = {
      current:''
    }
    console.log(window.location.href)
  }
  render() {
    let _menu = this.menuList.map((item,index)=>{
      return <Menu menu={item} key={index} cur={this.state.current}/>
    })
    return (
      <aside>
      <span className="toggle-icon">
        <i className="icon-aw-angle-double-right"></i>
      </span>
      <ul className="menu-level-1">
        {_menu}
      </ul>
      <Prompt message={this._change}/>
    </aside>
    );
  }
  _change(location){
    console.log(location);
    for(let j=0;j<this.menuList.length;j++){
      let flag = 0;
      if(this.menuList[j].child.length>0){
        for(let i=0;i<this.menuList[j].child.length;i++){
          if(this.menuList[j].child[i].href===location.pathname){
            this.setState({current:this.menuList[j].keywords});
            flag++;
            break;
          }
        }
      }
      if(flag>0){
        break;
      }
    }
    
    return true
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
      keyword:false,
      current:false
    }
    this._toggle = this._toggle.bind(this);
    
  }
  _toggle(){
    let val = this.state.keyword;
    this.setState({
      keyword:!val
    })
  }
  componentWillUpdate() {
    // for(let i=0;i<this.item.child.length;i++){
    //   if(this.item.child[i].href===this.props.cur){
    //     this.setState({current:true});
    //     break;
    //   }
    // }
    //console.log(this.props.onRouteEnter(this.props.match));
      //this.props.onRouteEnter(this.props.match); // 这里你可以根据需要传更多信息
  }
  // _change(location){
  //   console.log(location);
  //   this.item.child.forEach(item=>{
  //     if(item.href===location.path){
  //       this.setState({current:true});
  //     }
  //   })
  //   return true;
  // }
  render(){
    return(
        this.item.child.length>0?
          (
            <li className={"has-child "+(this.state.keyword?'level2-active ':'')+(this.props.cur===this.item.keywords?'active':'')}>
              <a onClick={this._toggle} className={this.props.cur===this.item.keywords?'active':''}>
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
