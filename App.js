import React, {useEffect, useState} from 'react';
import firebase from "firebase";
import {View, Image, Button} from "react-native";
import logo from "./assets/logo.png"
import FormLogin from "./components/user/formLogin";
import FormSignup from "./components/user/formSignup";
import HomeScreen from "./homeScreen";

//Firebase configuration.
const firebaseConfig = {
    apiKey: "AIzaSyCXlkO9ZUe4axYo3_sdjPzLaXNr-5B00S4",
    authDomain: "iont-ff9fd.firebaseapp.com",
    projectId: "iont-ff9fd",
    storageBucket: "iont-ff9fd.appspot.com",
    messagingSenderId: "726624841798",
    appId: "1:726624841798:web:cf63096d38f7c9891b1a47"
};

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