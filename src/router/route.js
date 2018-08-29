import {Router,Route} from 'react-router-dom';
//import Home from './home' 
 


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

let route = ()=>{
  return(
    <Router>
      <Route path="/" component={Home}/>
      <Route path="/resource/resourceview" component={Resourceview}/>
      <Route path="/pagemanage/platform" component={Platform}/>
    </Router>
  )
}






export default route;
