import React, { useCallback } from 'react'
import { View } from 'react-native'

import { createNavigator, TabRouter } from 'react-navigation'
import BottomNavigation, {FullTab} from 'react-native-material-bottom-navigation'

import ParentProfile from './ParentScreens/ParentProfile'
import ParentRoutines from './ParentScreens/ParentRoutines'
import Progress from './ParentScreens/Progress'
import ParentRewards from './ParentScreens/ParentRewards'
import Notifications from './ParentScreens/Notifications'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
Icon.loadFont();

/*
 * DONE: CHANGE PROFILE TO BUTTON
 * TODO : SET PIN BETWEEN SWITCH TO PARENT 
 */

//HEADER TITLES
const makeRoutineScreenConfig = navigation => {
  
    return {
      title: 'Routines',
      initialRouteName: 'ParentRoutines'
    }
}
const makeProgressScreenConfig = navigation => {
  
  return {
    title: 'Progress',
    initialRouteName: 'ParentRoutines'
  }
}

  const makeRewardsScreenConfig = navigation => {
    return {
      title: 'Rewards',
      initialRouteName: 'ParentRoutines'
    };
  }

  const makeProfileScreenConfig = navigation => {
    return {
      title: 'Profile',
      initialRouteName: 'ParentRoutines'
    };
  }

  const makeNotificationScreenConfig = navigation => {
    return {
      title: 'Notifications',
      initialRouteName: 'ParentRoutines'
    };
  }

/*** TAB CONFIGURATION ***/
// label can be added
function AppTabView(props) {
  const tabs = [
    {
      key: 'Progress',
      icon: 'chart-line-variant',
      label: 'Progress',
      barColor: '#FFFCF9',
      pressColor: 'rgba(255, 255, 255, .1)',
      title: 'Rewards'
    },
    {
    key: 'ParentRewards',
    icon: 'gift',
    label: 'Rewards',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, .1)',
    title: 'Rewards'
  },
  {
    key: 'ParentRoutines',
    icon: 'format-list-bulleted',
    label: 'Routines',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, 0.1)',
    title: 'Routines'
  },
  {
    key: 'Notifications',
    icon: 'bell',
    label: 'Notifications',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, .1)',
    title: 'Notifications'
  },
  {
    key: 'ParentProfile',
    icon: 'cogs',
    label: 'Settings',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, 0.1)',
    title: 'Settings'
  },
]

  //Set up multiple screens
  const { navigation, descriptors } = props
  const { routes, index } = navigation.state
  const activeScreenName = routes[index].key
  const descriptor = descriptors[activeScreenName]
  const ActiveScreen = descriptor.getComponent()

  const handleTabPress = useCallback(
    newTab => navigation.navigate(newTab.key),
    [navigation]
  )

 //Basic format of Navigation
 //Screens in Active Screen
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ActiveScreen navigation={descriptor.navigation} />
      </View>

      <BottomNavigation
      style={{height:70}}
        tabs={tabs}
        activeTab={activeScreenName}
        onTabPress={handleTabPress}
        renderTab={({ tab, isActive }) => (
          <FullTab style={{ flexDirection: 'row' }}
            labelStyle={{
              color: isActive ? '#FF6978' : '#848484',
              padding: 0,
              left: -40,
              top:1
            }}
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            //renderIcon={() => <Icon name={tab.icon} size={32} color="white" />} #352D39  848484
            renderIcon = {({ icon, isActive }) => (
              isActive ? <Icon name={tab.icon} size={32} color="#FF6978" style={{left:10}} />:
              <Icon name={tab.icon} size={32} color="#848484" style={{left:10}} />
            )}
          />
        )}
      />
    </View>
  )
}
//Routing Screens
const AppTabRouter = TabRouter({
  ParentProfile: { screen: ParentProfile},
  ParentRoutines: { screen: ParentRoutines},
  ParentRewards: { screen: ParentRewards},
  Progress: {screen: Progress},
  Notifications: {screen: Notifications},
 
},
{
  initialRouteName: "ParentRoutines"
});

//Navi + Header Titles
// Header Title helper functions located at top
const AppNavigator = createNavigator(AppTabView, AppTabRouter, {

    navigationOptions: ({ navigation }) => {
        const { routeName } = navigation.state.routes[navigation.state.index]
  
        if (routeName === 'ParentProfile') {
          return makeProfileScreenConfig(navigation)
        }
        if (routeName === 'Progress') {
          return makeProgressScreenConfig(navigation)
        }

        if (routeName === 'ParentRoutines') {
            return makeRoutineScreenConfig(navigation)
        }

        

      if (routeName === 'ParentRewards') {
        return makeRewardsScreenConfig(navigation)
    }
      if (routeName === 'Notifications') {
        return makeNotificationScreenConfig(navigation);
      }

        
}})

export default AppNavigator

/*import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { createNavigator, TabRouter } from 'react-navigation'
import BottomNavigation, { IconTab, FullTab } from 'react-native-material-bottom-navigation'

import ParentRoutines from './ParentScreens/ParentRoutines'
import ParentProfile from './ParentScreens/ParentProfile'
import ParentRewards from './ParentScreens/ParentRewards'
// import Activities from './ParentScreens/Activities'
// import Activity from './ParentScreens/Activity'
// import EditRoutine from './ParentScreens/EditRoutine'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
Icon.loadFont();


//HEADER TITLES
const makeRoutineScreenConfig = navigation => {
  return {
      title: 'Routines'
  }
}

const makeProfileScreenConfig = navigation => {
  return {
    title: 'ParentProfile'
  }
}

const makeRewardsScreenConfig = navigation => {
  return {
    title: 'Rewards'
  }
}

// const makeActivitiesScreenConfig = navigation => {
//   return {
//     title: 'Activities'
//   }
// }

// const makeEditRoutineScreenConfig = navigation => {
//   return {
//     title: 'Edit Routine',
//     prevScreenTitle: 'Activities'

//   }
// }

// const makeActivityScreenConfig = navigation => {
//   return {
//     title: 'Activity',
//     prevScreenTitle: 'Activities'
//   }
// }

/*** TAB CONFIGURATION ***/
// label can be added
/*
function AppTabView(props) {
  const tabs = [
    {
      key: 'Progress',
      icon: 'chart-line-variant',
      label: 'Progress',
      barColor: '#FFFCF9',
      pressColor: 'rgba(255, 255, 255, .1)',
      title: 'Rewards'
    },
    {
    key: 'Rewards',
    icon: 'gift',
    label: 'Rewards',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, .1)',
    title: 'Rewards'
  },
  {
    key: 'Routines',
    icon: 'format-list-bulleted',
    label: 'Routines',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, 0.1)',
    title: 'Routines'
  },{
    key: 'Notifications',
    icon: 'bell',
    label: 'Notifications',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, .1)',
    title: 'Rewards'
  },
  {
    key: 'Settings',
    icon: 'cogs',
    label: 'Settings',
    barColor: '#FFFCF9',
    pressColor: 'rgba(255, 255, 255, 0.1)',
    title: 'Profile'
  },
]


  //Set up multiple screens
  const { navigation, descriptors } = props
  const { routes, index } = navigation.state
  const activeScreenName = routes[index].key
  const descriptor = descriptors[activeScreenName]
  const ActiveScreen = descriptor.getComponent()

  const handleTabPress = useCallback(
    newTab => navigation.navigate(newTab.key),
    [navigation]
  )

  //Basic format of Navigation
  //Screens in Active Screen
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ActiveScreen navigation={descriptor.navigation} />
      </View>


      {/* Had to remove active tab until I figure 
      out how to have Routines tab active on edit 
      routine/ etc. 
      <BottomNavigation
      style={{height:70}}
        tabs={tabs}
        activeTab={activeScreenName}
        onTabPress={handleTabPress}
        renderTab={({ tab, isActive }) => (
          <FullTab style={{ flexDirection: 'row' }}
            labelStyle={{
              color: isActive ? '#FF6978' : '#848484',
              padding: 0,
              left: -40,
              top:1
            }}
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            //renderIcon={() => <Icon name={tab.icon} size={32} color="white" />} #352D39  848484
            renderIcon = {({ icon, isActive }) => (
              isActive ? <Icon name={tab.icon} size={32} color="#FF6978" style={{left:10}} />:
              <Icon name={tab.icon} size={32} color="#848484" style={{left:10}} />
            )}
          />
        )}
      />
    </View>
  )
}

//Routing Screens
const AppTabRouter = TabRouter({
  ParentRoutines: { screen: ParentRoutines },
  ParentProfile: { screen: ParentProfile },
  ParentRewards: { screen: ParentRewards },
  // Activities: { screen: Activities },
  // EditRoutine: { screen: EditRoutine },
  // Activity: { screen: Activity },
});

//Navi + Header Titles
// Header Title helper functions located at top
const AppNavigator = createNavigator(AppTabView, AppTabRouter, {

  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index]

    if (routeName === 'ParentRoutines') {
      return makeRoutineScreenConfig(navigation)
    }

    if (routeName === 'ParentProfile') {
      return makeProfileScreenConfig(navigation)
    }

    if (routeName === 'Rewards') {
      return makeRewardsScreenConfig(navigation)
    }
    // if (routeName === 'Activities') {
    //   return makeActivitiesScreenConfig(navigation)
    // }
    // if (routeName === 'EditRoutine') {
    //   return makeEditRoutineScreenConfig(navigation)
    // }
    // if (routeName === 'Activity') {
    //   return makeActivityScreenConfig(navigation)
    // }

  }
})

const styles = StyleSheet.create({
  nav: {
  }
});

export default AppNavigator*/

