import React, {Component} from 'react';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './Login';
import SignUp from './SignUp';
import ForgotPassowrd from './ForgotPassword';
import Pincode from './Pincode';
import Task1 from './Task1';
import Task2 from './Task2';

import ParentNavigation from './ParentSide/ParentNavigation';
import ParentRewards from './ParentSide/ParentScreens/ParentRewards';
import EditReward from './ParentSide/ParentScreens/EditReward';
import ParentProfile from './ParentSide/ParentScreens/ParentProfile';
import EditRoutine from './ParentSide/ParentScreens/EditRoutine';
import ParentRoutines from './ParentSide/ParentScreens/ParentRoutines';
import Activity from './ParentSide/ParentScreens/Activity';
import Progress from './ParentSide/ParentScreens/Progress';
import Notifications from './ParentSide/ParentScreens/Notifications';

import ChildRoutines from './ChildScreens/ChildNavigation';
import ChildActivity from './ChildScreens/ChildActivity';
import ChildPincode from './ChildScreens/ChildPincode';
import ChildNotifScreen from './ChildScreens/ChildNotifScreen';

import Camera from '../components/ImageRecognition/Camera';

import TestingHomePage from './TestingHomePage';

const Screens = createStackNavigator({
  TestingHomePage: {screen: TestingHomePage},
  Login: {screen: Login},
  SignUp: {screen: SignUp},
  Pincode: {screen: Pincode},
  ForgotPassword: {screen: ForgotPassowrd},
  Task1: {screen: Task1},
  Task2: {screen: Task2},

  ParentNavigation: {screen: ParentNavigation},
  ParentRoutines: {screen: ParentRoutines},
  Activity: {screen: Activity},
  ParentRewards: {screen: ParentRewards},
  EditReward: {screen: EditReward},
  ParentProfile: {screen: ParentProfile},
  EditRoutine: {screen: EditRoutine},
  Progress: {screen: Progress},
  Notifications: {screen: Notifications},

  ChildPincode: {screen: ChildPincode},
  ChildNotifScreen: {screen: ChildNotifScreen},
  ChildRoutines: {screen: ChildRoutines},
  ChildActivity: {screen: ChildActivity},

  Camera: {screen: Camera},
});

const App = createAppContainer(Screens);
export default App;
