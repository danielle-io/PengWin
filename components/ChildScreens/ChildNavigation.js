import React, {useCallback} from 'react';
import {View} from 'react-native';

import {createNavigator, TabRouter} from 'react-navigation';
import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation';

import ChildRoutines from './ChildRoutines';
import ChildRewards from './ChildRewards';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
Icon.loadFont();

/*
 * DONE: CHANGE PROFILE TO BUTTON
 * TODO : SET PIN BETWEEN SWITCH TO PARENT
 */

//HEADER TITLES
const makeRoutineScreenConfig = navigation => {
  return {
    title: 'My Routine',
    headerRight: () => (
      <Icon
        style={{padding: 15, color: '#848484'}}
        name={'account-circle'}
        size={25}
        onPress={() => {
          navigation.navigate('ChildPincode', {
            prevScreenTitle: 'My Routines',
          });
        }}
      />
    ),
  };
};

const makeRewardsScreenConfig = navigation => {
  return {
    title: 'My Rewards',
    headerRight: () => (
      <Icon
        style={{padding: 15, color: '#848484'}}
        name={'account-circle'}
        size={25}
        onPress={() => {
          navigation.navigate('ChildPincode', {
            prevScreenTitle: 'My Routines',
          });
        }}
      />
    ),
  };
};

/*** TAB CONFIGURATION ***/
// label can be added
function AppTabView(props) {
  const tabs = [
    {
      key: 'ChildRewards',
      icon: 'gift',
      label: 'Rewards',
      barColor: '#B1EDE8',
      pressColor: 'rgba(255, 255, 255, .1)',
      title: 'My Rewards',
    },
    {
      key: 'ChildRoutines',
      icon: 'format-list-bulleted',
      label: 'Routines',
      barColor: '#B1EDE8',
      pressColor: 'rgba(255, 255, 255, 0.1)',
      title: 'My Routines',
    },
  ];

  //Set up multiple screens
  const {navigation, descriptors} = props;
  const {routes, index} = navigation.state;
  const activeScreenName = routes[index].key;
  const descriptor = descriptors[activeScreenName];
  const ActiveScreen = descriptor.getComponent();

  const handleTabPress = useCallback(
    newTab => navigation.navigate(newTab.key),
    [navigation],
  );

  //Basic format of Navigation
  //Screens in Active Screen
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ActiveScreen navigation={descriptor.navigation} />
      </View>

      <BottomNavigation
        style={{height: 90}}
        tabs={tabs}
        activeTab={activeScreenName}
        onTabPress={handleTabPress}
        renderTab={({tab, isActive}) => (
          <FullTab
            style={{flexDirection: 'row'}}
            labelStyle={{
              color: isActive ? '#352D39' : '#848484',
              padding: 0,
              left: -50,
              top: 1,
            }}
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            //renderIcon={() => <Icon name={tab.icon} size={32} color="white" />} #352D39  848484
            renderIcon={({icon, isActive}) =>
              isActive ? (
                <Icon
                  name={tab.icon}
                  size={32}
                  color="#352D39"
                  style={{left: 20}}
                />
              ) : (
                <Icon
                  name={tab.icon}
                  size={32}
                  color="#848484"
                  style={{left: 20}}
                />
              )
            }
          />
        )}
      />
    </View>
  );
}

//Routing Screens
const AppTabRouter = TabRouter({
  ChildRoutines: {screen: ChildRoutines},
  ChildRewards: {screen: ChildRewards},
});

//Navi + Header Titles
// Header Title helper functions located at top
const AppNavigator = createNavigator(AppTabView, AppTabRouter, {
  navigationOptions: ({navigation}) => {
    const {routeName} = navigation.state.routes[navigation.state.index];

    if (routeName === 'ChildRoutines') {
      return makeRoutineScreenConfig(navigation);
    }

    if (routeName === 'ChildRewards') {
      return makeRewardsScreenConfig(navigation);
    }
  },
});

export default AppNavigator;
