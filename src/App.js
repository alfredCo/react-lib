import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      abc:'222',
      ac:'ds',
      newValue:"",
      todoLists:[{text:123,key:1},{text:456,key:2}]
    };
  }
  render() {
    let _list = this.state.todoLists.map((item)=>{
      return <li key={item.key}>{item.text}</li>
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
  add(){
    let todoLists = this.state.todoLists;
    todoLists = todoLists.concat([{text:this.state.newValue,key:'22'}])
    //this.state.todoLists.push({text:this.state.newValue,key:'22'})
    this.setState({todoLists});
  }
}

export default App;
