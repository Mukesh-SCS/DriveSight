import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import HomeScreen from '@screens/HomeScreen';
import StudyModeScreen from '@screens/StudyModeScreen';
import MockTestScreen from '@screens/MockTestScreen';
import SignScanScreen from '@screens/SignScanScreen';
import SignExplanationScreen from '@screens/SignExplanationScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="StudyHome"
        component={StudyModeScreen}
        options={{ title: 'Study Mode' }}
      />
      <Stack.Screen
        name="SignExplanation"
        component={SignExplanationScreen}
        options={{ title: 'Sign Details' }}
      />
    </Stack.Navigator>
  );
}

function TestStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="TestHome"
        component={MockTestScreen}
        options={{ title: 'Mock Tests' }}
      />
    </Stack.Navigator>
  );
}

function ScanStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="ScanHome"
        component={SignScanScreen}
        options={{ title: 'Scan Sign' }}
      />
      <Stack.Screen
        name="ScanResult"
        component={SignExplanationScreen}
        options={{ title: 'Sign Details' }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Study"
          component={StudyStack}
          options={{
            title: 'Study',
            tabBarLabel: 'Study',
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanStack}
          options={{
            title: 'Scan',
            tabBarLabel: 'Scan',
          }}
        />
        <Tab.Screen
          name="Test"
          component={TestStack}
          options={{
            title: 'Tests',
            tabBarLabel: 'Tests',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
