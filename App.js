import React from 'react';
import firebase from "firebase";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import add_edit_event from "./components/add_edit_event";
import eventDetails from "./components/eventDetails";
import eventList from "./components/eventList";
import {NavigationContainer} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {StyleSheet, View, Text, Image} from "react-native";
import logo from "./assets/logo.png"

// Opretter stack og tab.
export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  //Firebase configuration.
  const firebaseConfig = {
      apiKey: "AIzaSyArl2Wks6eXrxThyRq2b3R_582anJ7JLG4",
      authDomain: "afleveringopretevent.firebaseapp.com",
      databaseURL: "https://afleveringopretevent-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "afleveringopretevent",
      storageBucket: "afleveringopretevent.appspot.com",
      messagingSenderId: "1067329306598",
      appId: "1:1067329306598:web:fbd754e30084318326a027"
  };

//Initialiserer Firebase.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

    function HomeScreen() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <Image source={logo} style={{width:380, height:380}} ></Image>
            </View>
        );
    }


// Opretter en konstant StackNavigation som navigerer mellem de tre screens.
const StackNavigation = () => {
  return (
          <Stack.Navigator>
        <Stack.Screen name={"Event List"} component={eventList} options={{title: "Your Event List",
            headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
        <Stack.Screen name={"Event Details"} component={eventDetails} options={{title: "Event Details",
            headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
        <Stack.Screen name={"Edit Event"} component={add_edit_event} options={{title: "Edit Event",
            headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
      </Stack.Navigator>
  )
}

 // Opretter en navigations container så man kan navigere mellem "Upcoming Events" tab og "Add Event" tabs. 
  return (
      <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name={'Home'} component={HomeScreen} options={{tabBarIcon: () => ( <Ionicons name="home" size={30} color={"#4db5ac"} />),headerShown:null}}/>
            <Tab.Screen name={'Upcoming Events'} component={StackNavigation} options={{tabBarIcon: () => ( <Ionicons name="list" size={30} color={"#4db5ac"} />),headerShown:null}}/>
          <Tab.Screen name={'Add Event'} component={add_edit_event} options={{tabBarIcon: () => ( <Ionicons name="add" size={30} color={"#4db5ac"}/>), title: "Add Event",
              headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold"}}}/>
        </Tab.Navigator>
      </NavigationContainer>
  );
}
