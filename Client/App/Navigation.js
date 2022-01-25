import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import Gps, {
  screenOptions as gpsScreenOptions,
} from "./screens/User/Location/Gps";
import Chats, {
  screenOptions as chatScreenOptions,
} from "./screens/User/Chat/Chats";
import Messages, {
  screenOptions as messagesScreenOptions,
} from "./screens/User/Chat/Messages";
import GpsSecond from "./screens/User/Location/GpsSecond";
import { color } from "./constanst";
import Games from "./screens/User/Games/Games";
import SearchUser from "./screens/User/Chat/SearchUser";
import Call from "./screens/User/Chat/Call";

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Register"
      component={Register}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const GamesStack = createStackNavigator();
const MessagesStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Chat"
      component={Chats}
      options={chatScreenOptions}
    />
    <HomeStack.Screen
      name="SearchUser"
      component={SearchUser}
      options={() => ({
        title: "Find a friend",
        headerTitleStyle: {
          color: color,
        },
        headerTintColor: color,
      })}
    />
  </HomeStack.Navigator>
);

const MessagesStackScreen = () => (
  <MessagesStack.Navigator>
    <HomeStack.Screen
      name="Messages"
      component={Messages}
      options={messagesScreenOptions}
    />
    <HomeStack.Screen
      name="Call"
      component={Call}
      options={{ headerShown: false }}
    />
  </MessagesStack.Navigator>
);

const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="Location"
      component={Gps}
      options={gpsScreenOptions}
    />
    <SearchStack.Screen name="GpsSecond" component={GpsSecond} />
  </SearchStack.Navigator>
);

const GamesStackScreen = () => (
  <GamesStack.Navigator>
    <GamesStack.Screen
      name="Games"
      component={Games}
      options={() => ({
        headerTitleStyle: {
          color: color,
        },
      })}
    />
  </GamesStack.Navigator>
);

const TabsScreen = () => (
  <Tabs.Navigator
    tabBarOptions={{
      inactiveTintColor: "grey",
      activeBackgroundColor: color,
      inactiveBackgroundColor: color,
      activeTintColor: "white",
    }}
  >
    <Tabs.Screen
      name="Chat"
      component={HomeStackScreen}
      options={{
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="chatbox-ellipses-outline"
              size={27}
              color={tabInfo.focused ? "white" : "grey"}
            />
          );
        },
      }}
    />
    <Tabs.Screen
      name="Location"
      component={SearchStackScreen}
      options={{
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="locate-outline"
              size={28}
              color={tabInfo.focused ? "white" : "grey"}
            />
          );
        },
      }}
    />
    <Tabs.Screen
      name="Games"
      component={GamesStackScreen}
      options={{
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="game-controller-outline"
              size={28}
              color={tabInfo.focused ? "white" : "grey"}
            />
          );
        },
      }}
    />
  </Tabs.Navigator>
);

const RootStack = createStackNavigator();
export default function RootStackScreen({ token }) {
  return (
    <RootStack.Navigator headerMode="none">
      {token ? (
        <>
          <RootStack.Screen
            name="App"
            component={TabsScreen}
            options={{
              animationEnabled: true,
            }}
          />
          <RootStack.Screen
            name="MessagesNav"
            component={MessagesStackScreen}
            options={{
              animationEnabled: true,
            }}
          />
        </>
      ) : (
        <>
          <RootStack.Screen
            name="Auth"
            component={AuthStackScreen}
            options={{
              animationEnabled: true,
            }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}
