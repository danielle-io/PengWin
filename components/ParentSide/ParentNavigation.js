import React, { useCallback } from "react";
import { View } from "react-native";

import { createNavigator, TabRouter } from "react-navigation";
import BottomNavigation, {
  FullTab,
} from "react-native-material-bottom-navigation";

import ParentProfile from "./ParentScreens/ParentProfile";
import ParentRoutines from "./ParentScreens/ParentRoutines";
import Progress from "./ParentScreens/Progress";
import ParentRewards from "./ParentScreens/ParentRewards";
import Notifications from "./ParentScreens/Notifications";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
Icon.loadFont();

const makeRoutineScreenConfig = (navigation) => {
  return {
    title: "Routines",
    initialRouteName: "ParentRoutines",
  };
};
const makeProgressScreenConfig = (navigation) => {
  return {
    title: "Progress",
    initialRouteName: "ParentRoutines",
  };
};

const makeRewardsScreenConfig = (navigation) => {
  return {
    title: "Rewards",
    initialRouteName: "ParentRoutines",
  };
};

const makeProfileScreenConfig = (navigation) => {
  return {
    title: "Profile",
    initialRouteName: "ParentRoutines",
  };
};

const makeNotificationScreenConfig = (navigation) => {
  return {
    title: "Notifications",
    initialRouteName: "ParentRoutines",
  };
};

/*** TAB CONFIGURATION ***/
function AppTabView(props) {
  const tabs = [
    {
      key: "Progress",
      icon: "chart-line-variant",
      label: "Progress",
      barColor: "#FFFCF9",
      pressColor: "rgba(255, 255, 255, .1)",
      title: "Rewards",
    },
    {
      key: "ParentRewards",
      icon: "gift",
      label: "Rewards",
      barColor: "#FFFCF9",
      pressColor: "rgba(255, 255, 255, .1)",
      title: "Rewards",
    },
    {
      key: "ParentRoutines",
      icon: "format-list-bulleted",
      label: "Routines",
      barColor: "#FFFCF9",
      pressColor: "rgba(255, 255, 255, 0.1)",
      title: "Routines",
    },
    {
      key: "Notifications",
      icon: "bell",
      label: "Notifications",
      barColor: "#FFFCF9",
      pressColor: "rgba(255, 255, 255, .1)",
      title: "Notifications",
    },
    {
      key: "ParentProfile",
      icon: "account",
      label: "Profile",
      barColor: "#FFFCF9",
      pressColor: "rgba(255, 255, 255, 0.1)",
      title: "Profile",
    },
  ];

  //Set up multiple screens
  const { navigation, descriptors } = props;
  const { routes, index } = navigation.state;
  const activeScreenName = routes[index].key;
  const descriptor = descriptors[activeScreenName];
  const ActiveScreen = descriptor.getComponent();

  const handleTabPress = useCallback(
    (newTab) => navigation.navigate(newTab.key),
    [navigation]
  );

  //Basic format of Navigation
  //Screens in Active Screen
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFCF9" }}>
      <View style={{ flex: 1 }}>
        <ActiveScreen navigation={descriptor.navigation} />
      </View>

      <BottomNavigation
        style={{ height: 70 }}
        tabs={tabs}
        activeTab={activeScreenName}
        onTabPress={handleTabPress}
        renderTab={({ tab, isActive }) => (
          <FullTab
            style={{ flexDirection: "row" }}
            labelStyle={{
              color: isActive ? "#FF6978" : "#848484",
              padding: 0,
              left: tab.key === "ParentProfile" ? -70 : -44,
              top: 1,
            }}
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            //renderIcon={() => <Icon name={tab.icon} size={32} color="white" />} #352D39  848484
            renderIcon={({ icon, isActive }) =>
              isActive ? (
                <Icon
                  name={tab.icon}
                  size={32}
                  color="#FF6978"
                  style={{ left: 10 }}
                />
              ) : (
                <Icon
                  name={tab.icon}
                  size={32}
                  color="#848484"
                  style={{ left: 10 }}
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
const AppTabRouter = TabRouter(
  {

    Notifications: { screen: Notifications },
    ParentProfile: { screen: ParentProfile },
    ParentRoutines: { screen: ParentRoutines },
    ParentRewards: { screen: ParentRewards },
    Progress: { screen: Progress },
    Notifications: { screen: Notifications },
  },
);

//Navi + Header Titles
// Header Title helper functions located at top
const AppNavigator = createNavigator(AppTabView, AppTabRouter, {
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];

    if (routeName === "ParentProfile") {
      return makeProfileScreenConfig(navigation);
    }
    if (routeName === "Progress") {
      return makeProgressScreenConfig(navigation);
    }

    if (routeName === "ParentRoutines") {
      return makeRoutineScreenConfig(navigation);
    }

    if (routeName === "ParentRewards") {
      return makeRewardsScreenConfig(navigation);
    }
    if (routeName === "Notifications") {
      return makeNotificationScreenConfig(navigation);
    }
  },
});
export default AppNavigator;
