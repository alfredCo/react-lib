import React, { Component } from 'react';
import {Router,Route,Switch} from 'react-router-dom';
//import Home from './home' 
 
let route = ()=>{
  return(
    <div className="main-content">
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/resource/resourceview" component={Resourceview}/>
      <Route path="/pagemanage/platform" component={Platform}/>
      <Route path="/pagemanage/carousel" component={Platform}/>
      <Route path="/admanage/college" component={Platform}/>
      <Route path="/coursemanage/tags" component={Platform}/>
      </Switch>
    </div>
  )
}

let Home = ()=>{
  return (
    <div>Home</div>
  )
}
let Resourceview = ()=>{
  return (
    <div>Resourceview</div>
  )
}
let Platform = ()=>{
  return (
    <div>Platform</div>
  )
}






export default route;
