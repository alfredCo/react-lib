import React, { Component } from 'react';
import Header from './component/header'
import SideMenu from './component/sidemenu'
import Main from './component/route'
import './App.css';
import 'antd/dist/antd.css';
//import axios from 'axios';

class ListItem extends Component {
  constructor(){
    super();
    //this.del = this.del.bind(this);
  }
  render(){
    return <li>{this.props.data.text}<span onClick={this.del}>xxx</span></li>
  }
  del(){
    console.log(this);
    //this.props.del(this.props.data.text);
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      abc:'222',
      ac:'ds',
      newValue:"",
      todoLists:[{text:123,key:1},{text:456,key:2}]
    };
    this.del = this.del.bind(this);
  }
  render() {
    let _list = this.state.todoLists.map((item)=>{
      return <ListItem key={item.key} del={this.del} data={item}/>
      //return <li key={item.key}>{item.text}<span onClick={this.del}>xxx</span></li>
    })

    return (
      <div className="App">
        <ul>
          {_list}
        </ul>
        <div>
          <input type="text" value={this.state.newValue} onChange={this.change.bind(this)}/>
          <button onClick={this.add.bind(this)}>add</button>
        </div>
      </div>
    );
  }
  change(e){
    this.setState({newValue:e.target.value})
  };
  del(val){
    console.log(val);
    let todoLists = this.state.todoLists.filter(item=>val!==item.text);
    this.setState({todoLists});
  }
  add(){
    let todoLists = this.state.todoLists;
    todoLists = todoLists.concat([{text:this.state.newValue,key:'22'}])
    //this.state.todoLists.push({text:this.state.newValue,key:'22'})
    this.setState({todoLists});
    this.setState({newValue:''})
  }
}

class Bpp extends Component{
  render(){
    return (
      <div>
        <Header/>
        <div className="main">
          <SideMenu/>
          <Main/>
        </div>
      </div>
    )
  }
}




export default Bpp;
