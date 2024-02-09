import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './component/Home';
import Login from './component/Login';
import Navbar from './component/Navbar';
import Profile from './component/Profile';
import Register from './component/Register';

const App = () => {
  return (
    <>
    <Navbar/>
    <Switch>
      <Route exact path ="/" component={Home}/>
      <Route exact path ="/login" component={Login}/>
      <Route exact path ="/register" component={Register}/>
      <Route exact path ="/profile" component={Profile}/>
    
    </Switch>
    

    </>
  )
}

export default App;



