import React, {useEffect, useState} from 'react';
import firebase from "firebase";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import add_edit_event from "./components/event/add_edit_event";
import eventDetails from "./components/event/eventDetails";
import eventList from "./components/event/eventList";
import Map from "./components/event/Map"
import {NavigationContainer} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {StyleSheet, View, Text, Image, Button, LogBox} from "react-native";
import logo from "./assets/logo.png"
import FormLogin from "./components/user/formLogin";
import FormSignup from "./components/user/formSignup";
import HomeScreen from "./homeScreen";
import { initializeApp } from "firebase/app";

//Firebase configuration.
const firebaseConfig = {
    apiKey: "AIzaSyB_Ae2j4YTjZpwx4pQaBJWgAVsPuiNx0TI",
    authDomain: "eksamensprojekt-4d5e8.firebaseapp.com",
    databaseURL: "https://eksamensprojekt-4d5e8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "eksamensprojekt-4d5e8",
    storageBucket: "eksamensprojekt-4d5e8.appspot.com",
    messagingSenderId: "733436120965",
    appId: "1:733436120965:web:1046fbe85736c41ff1beec"
};
//Not write warnings.
firebase.setLogLevel('silent');
LogBox.ignoreLogs(['Setting a timer']); // https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes

// hvorfor skal funktionen eksporteres??
export default function App() {
// de state variable vi skal bruge til bruger
    const [user, setUser] = useState({loggedIn: false});

//Initialiserer Firebase.
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

// function fra firebase som holder øje med om brugeren er logget ind eller ej
    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback({loggedIn: true, user: user});
            } else {
                callback({loggedIn: false});
            }
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChange(setUser);
        return () => {
            unsubscribe();
        };
    }, []);

    const StartScreen = (navigation) =>{
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff'}}>
                <Image source={logo} style={{width: 380, height: 380}}/>
                <FormSignup/>
                <FormLogin/>
                <Button onPress={() => navigation.navigate('Upcoming Events')} title="Create user later"/>
            </View>
        );
    }
    return user.loggedIn ? <HomeScreen/> : <StartScreen/> ;
}
