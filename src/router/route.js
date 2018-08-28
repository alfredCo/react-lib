import {Router,Route} from 'react-router-dom';
//import Home from './home' 
 
let route = ()=>{
  return(
    <Router>
      <Route path="/" component={Home}/>
      <Route path="/resource/resourceview" component={Resourceview}/>
      <Route path="/pagemanage/platform" component={Platform}/>
    </Router>
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
