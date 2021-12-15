import React, {useEffect, useState} from 'react';
import firebase from "firebase";

import {StyleSheet, View, Text, Image, Button, LogBox} from "react-native";
import logo from "./assets/logo.png"
import line from "./assets/Line.jpg"
import FormLogin from "./components/user/formLogin";
import FormSignup from "./components/user/formSignup";
import HomeScreen from "./homeScreen";

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
LogBox.ignoreLogs(['Setting a timer', 'Warning']); // https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
//LogBox.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];

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
            <View style={styles.container}>
                <Image source={logo} style={styles.img}/>
                <FormLogin/>
                <Image source={line} style={styles.img2}/>
                <Text style={styles.labl}> Har du ikke en bruger endnu?</Text>
                <Text style={styles.labl}> Opret en bruger her: </Text>
                <FormSignup/>

            </View>
        );
    }
    return user.loggedIn ? <HomeScreen/> : <StartScreen/> ;
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#ffffff',
    },
    img: {
        width: 450,
        height: 180,
        marginTop: 30,
    },
    img2: {
        height: 10,
        marginTop: 15,
        marginBottom: 5,
    }, labl: {
        color: "#ec6e35",
    }

});