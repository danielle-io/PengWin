import React, { Component } from "react";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "./Login";
import SignUp from "./SignUp";
import Pincode from "./Pincode";
import HomePage from './HomePage';

import ParentNavigation from "./ParentSide/ParentNavigation";
import EditReward from "./ParentSide/ParentScreens/EditReward";
import ParentProfile from "./ParentSide/ParentScreens/ParentProfile";
import PublicActivities from "./ParentSide/ParentScreens/PublicActivities";
import ViewPublicActivity from "./ParentSide/ParentScreens/ViewPublicActivity";
import EditRoutine from "./ParentSide/ParentScreens/EditRoutine";
import EditActivity from "./ParentSide/ParentScreens/EditActivity";
import Progress from "./ParentSide/ParentScreens/Progress";
import Notifications from "./ParentSide/ParentScreens/Notifications";
import RoutineApproval from "./ParentSide/ParentScreens/RoutineApproval";
import CheckOffRoutine from "./ParentSide/ParentScreens/CheckOffRoutine";

import Questionnaire from './ParentSide/ParentScreens/Questionnaire';

import ChildRoutines from "./ChildScreens/ChildNavigation";
import ChildActivity from "./ChildScreens/ChildActivity";
import ChildPincode from "./ChildScreens/ChildPincode";
import ChildNotifScreen from "./ChildScreens/ChildNotifScreen";
import ChildRewards from "./ChildScreens/ChildRewards";
import ChildMap from "./ChildScreens/ChildMap";
import ChildHurray from "./ChildScreens/ChildHurray";
import ChildActivityReward from "./ChildScreens/ChildActivityReward";
import ChildStartActivity from "./ChildScreens/ChildStartActivity";
import ChildCamera from "../components/ImageRecognition/ChildCamera";
import TestingHomePage from "./TestingHomePage";

const Screens = createStackNavigator({
  TestingHomePage: {screen: TestingHomePage},
  ChildRoutines: { screen: ChildRoutines },
  ParentNavigation: {screen: ParentNavigation},
  Login: {screen: Login},
  SignUp: {screen: SignUp},
  Pincode: {screen: Pincode},
  ChildCamera: {screen: ChildCamera },    

  EditActivity: { screen: EditActivity },
  PublicActivities: { screen: PublicActivities },
  ViewPublicActivity: { screen: ViewPublicActivity },
  CheckOffRoutine: {screen: CheckOffRoutine },    

  Questionnaire: {screen:Questionnaire},
  Notifications: {screen: Notifications},
  EditReward: { screen: EditReward },
  ParentProfile: { screen: ParentProfile },
  EditRoutine: { screen: EditRoutine },
  Progress: { screen: Progress },
  RoutineApproval: { screen: RoutineApproval },

  ChildPincode: { screen: ChildPincode },
  ChildNotifScreen: { screen: ChildNotifScreen },
  ChildActivity: { screen: ChildActivity },
  ChildMap: { screen: ChildMap },
  ChildRewards: { screen: ChildRewards },
  ChildStartActivity: { screen: ChildStartActivity },
  ChildHurray: { screen: ChildHurray },
  ChildActivityReward: { screen: ChildActivityReward },
});

const App = createAppContainer(Screens);
export default App;