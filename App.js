import React, { Component } from 'react';
import { Dimensions } from "react-native";
import ScreenManager from './components/ScreenManager';


class App extends Component{
  constructor(props){
      super(props);
      this.state={

      }
  }
  
  componentDidMount(){
    this.authListener();
  }
    authListener(){
      fire.auth().onAuthStateChanged((user)=>{
        if(user)
        {
          this.setState({user})
        }
          else{
            this.setState({user : null})
          }
        
      })
    }

  render(){
    return(
      
      <div className="App">
        {/* {this.state.user ? (<Routines/>) : (<Login/>)} */}
      </div>
    );
    }
  }
  
export default ScreenManager;

