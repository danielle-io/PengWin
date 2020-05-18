import React, { Component } from "react";
// import Picker from 'react-giphy-component'


export default class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Forgot Password",
    prevScreenTitle: "Login",
  });

  constructor() {
    super();
    this.state = {

    };
  }
}



// // import ReactDOM from 'react-dom'
// import React, { Component } from 'react'
 
// export default class ForgotPassword extends React.Component {
//   // log (gif) {
//   //   console.log(gif)
//   // }
 
//   render () {
//     return (
//         {/* <Picker onSelected={this.log.bind(this)} /> */}
//     )
//   }
// }