import {Button, Text, SafeAreaView} from "react-native";
import firebase from "firebase";
import React from "react";

// brugerens egen side, kan tilgås når der er logget ind og viser abonnerede begivenheder?
// evt også begivenheder man selv har oprettet?
// skal føre til login siden hvis ikke man er logget ind? altså const StartScreen fra App.js

export default function Profile() {
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    return (
        <SafeAreaView>
            <Text>
                Current user: {firebase.auth().currentUser.email}
            </Text>
            <Button onPress={() => handleLogOut()} title="Log out" />
        </SafeAreaView>
    )
}