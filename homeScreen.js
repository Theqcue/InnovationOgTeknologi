import React from 'react';
import {View, Text} from 'react-native';
import firebase from 'firebase';
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import eventList from "./components/event/eventList";
import eventDetails from "./components/event/eventDetails";
import add_edit_event from "./components/event/add_edit_event";
import Profile from "./components/user/profile";
import Ionicons from "react-native-vector-icons/Ionicons";
import AllEventsMap from "./components/event/AllEventsMap";
import Picker from "./components/event/Picker";

// siden man henvises til når man logger ind. Fører direkte til øverste lag i stacknavigatoren,
// dvs. Upcoming Events lige nu.

function HomeScreen(){
    if (!firebase.auth().currentUser) {
        return <View><Text>Not found</Text></View>;
    }

    const Stack = createStackNavigator();
    const Stack2 = createStackNavigator();
    const Tab = createBottomTabNavigator();

    // Opretter en konstant StackNavigation som navigerer mellem de tre screens.
    const StackNavigation = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name={"Event List"} component={eventList} options={{title: "All Events",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
                <Stack.Screen name={"Event Details"} component={eventDetails} options={{title: "Event Details",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
                <Stack.Screen name={"Edit Event"} component={add_edit_event} options={{title: "Edit Event",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
            </Stack.Navigator>
        )
    }

    const StackNavigationProfile = () => {
        return (
            <Stack2.Navigator>
                <Stack2.Screen name={"User Profile"} component={Profile} options={{title: "Profile",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
                <Stack2.Screen name={"Event Details"} component={eventDetails} options={{title: "Event Details",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
                <Stack2.Screen name={"Edit Event"} component={add_edit_event} options={{title: "Edit Event",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>

            </Stack2.Navigator>
        )
    }

    const StackNavigationAllMap = () => {
        return (
            <Stack2.Navigator>
                <Stack2.Screen name={"Map for all events"} component={AllEventsMap} options={{title: "All Events",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
                <Stack2.Screen name={"Event Details"} component={eventDetails} options={{title: "Event Details",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>
                <Stack2.Screen name={"Edit Event"} component={add_edit_event} options={{title: "Edit Event",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold",}, headerStatusBarHeight:25}}/>

            </Stack2.Navigator>
        )
    }
    // Opretter en navigations container så man kan navigere mellem "Upcoming Events" tab og "Add Event" tabs.
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name={'Home'} component={StackNavigationProfile} options={{tabBarIcon: () => ( <Ionicons name="home" size={30} color={"#4db5ac"} />),headerShown:null}}/>
                <Tab.Screen name={'Upcoming Events'} component={StackNavigation} options={{tabBarIcon: () => ( <Ionicons name="list" size={30} color={"#4db5ac"} />),headerShown:null}}/>
                <Tab.Screen name={'Add Event'} component={add_edit_event} options={{tabBarIcon: () => ( <Ionicons name="add" size={30} color={"#4db5ac"}/>), title: "Add Event",
                    headerStyle:{borderColor: "#4db5ac"}, headerTintColor:"#ec6e35", headerTitleStyle:{fontWeight:"bold"}}}/>
                <Tab.Screen name={'All Event Map'} component={StackNavigationAllMap} options={{tabBarIcon: () => ( <Ionicons name="globe-outline" size={30} color={"#4db5ac"} />),headerShown:null}}/>

            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default HomeScreen;