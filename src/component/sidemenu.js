import React, { Component } from 'react';
import {Link} from "react-router-dom";
import GLOBALDATA from './config/globalSetting';



class SideMenu extends Component {
  constructor(){
    super();
    this.state = {
      abc:'222',
      ac:'ds',
      newValue:"",
      todoLists:[{text:123,key:1},{text:456,key:2}]
    };
    this.del = this.del.bind(this);
    this.menuList = GLOBALDATA.ADMIN_MENU;
  }
  render() {
    let _list = this.state.todoLists.map((item)=>{
      return <ListItem key={item.key} del={this.del} data={item}/>
      //return <li key={item.key}>{item.text}<span onClick={this.del}>xxx</span></li>
    })

    return (
      <aside toggle-nav>
      <span class="toggle-icon">
        <i class="icon-aw-angle-double-right"></i>
      </span>
      <ul class="menu-level-1">
        <li ng-repeat="item in sideMenu.sideMenuList" ng-class="{'level2-active':sideMenu.activeSubMenu==item.keywords,'active':checkActive(item),'has-child':item.child.length>0}">
          <a ng-href="{{item.href}}" ng-class="{'active':checkActive(item)}">
            <span ng-click="sideMenu.activeSubMenu=item.keywords"><i class="{{item.icon}}"></i><b ng-bind="'cn.menu.'+item.keywords | translate"></b></span>
            <i class="icon-arrow" ng-if="item.child.length>0" ng-click="sideMenu.activeSubMenu=item.keywords"></i>
          </a>
          <a ng-href="{{item.href}}" class="close-show-title" ng-if="item.child.length<1" ng-bind="'cn.menu.'+item.keywords | translate"></a>
          <ul class="menu-level-2" ng-if="item.child.length>0">
            <li ng-repeat="subItem in item.child">
              <a ng-href="{{subItem.href}}" ng-class="{'sub-active':sideMenu.menuKeyword==subItem.active}">
                <span><i class="pointer"></i>{'cn.menu.'+subItem.keywords}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
    );
  }
  
}

class Menu extends Component{
  render(){
    return(
      <li ng-class="{'level2-active':sideMenu.activeSubMenu==item.keywords,'active':checkActive(item),'has-child':item.child.length>0}">
          <Link to={this.item.href} ng-class="{'active':checkActive(item)}">
            <span onClick="sideMenu.activeSubMenu=item.keywords"><i class={this.item.icon}></i><b>{this.item.name}</b></span>
            <i class="icon-arrow" ng-if="item.child.length>0" onClick="sideMenu.activeSubMenu=item.keywords"></i>
          </Link>
          <a ng-href="{{item.href}}" class="close-show-title" ng-if="item.child.length<1" ng-bind="'cn.menu.'+item.keywords | translate"></a>
          <ul class="menu-level-2" ng-if="item.child.length>0">
            <li ng-repeat="subItem in item.child">
              <a ng-href="{{subItem.href}}" ng-class="{'sub-active':sideMenu.menuKeyword==subItem.active}">
                <span><i class="pointer"></i>{'cn.menu.'+subItem.keywords}</span>
              </a>
            </li>
          </ul>
        </li>
    )
  }
}



export default SideMenu;
