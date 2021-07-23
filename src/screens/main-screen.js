import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './home-screen';
import Finder from './finder';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
      }}>
      <Tab.Screen
        name="Stats"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused, size, color}) => (
            <Icon size={size} color={color} name={'bar-chart'} />
          ),
        }}
      />
      <Tab.Screen
        name="Find Vaccine Slots"
        component={Finder}
        options={{
          tabBarIcon: ({focused, size, color}) => (
            <Icon size={size} color={color} name={'search'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;
