import {Button, Text, SafeAreaView, TouchableOpacity, View, Image, FlatList, StyleSheet} from "react-native";
import firebase from "firebase";
import React, {useEffect, useState} from "react";
import add_edit_event from "../event/add_edit_event";

// brugerens egen side, kan tilgås når der er logget ind og viser abonnerede begivenheder?
// evt også begivenheder man selv har oprettet?
// skal føre til login siden hvis ikke man er logget ind? altså const StartScreen fra App.js

const Profile = ({navigation,route}) => {
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    const [Events,setEvents] = useState([])

    useEffect(() => {
        if(Events.length < 1) {
            firebase.database()
                .ref(`userEvents`)
                .orderByChild('userId')
                .equalTo(firebase.auth().currentUser.uid)
                .on("value", function(snapshot) {
                    if (snapshot.exists()){
                        const eventId = Object.values(snapshot.val())[0].eventId;
                        eventId.map((id =>
                        {
                            firebase
                                .database()
                                // Eventets ID sættes ind.
                                .ref(`/Events/${id}`)
                                // Eventets data fjernes.
                                .on('value', snapshot => {
                                if(snapshot.exists()) {
                                    setEvents((oldArray) => [...oldArray, snapshot.val()]);
                                } else
                                {
                                    console.log('Does not exist');
                                }
                                });
                        }));
                    }
                });
            }
    },[]);

    const eventArray = Object.values(Events);
    const eventId = Object.keys(Events);

    if (Events.length < 1) {
        return <Text>You have no upcoming events</Text>;
    } else{
    }

    const handleSelectEvent = id => {
        const Event = Object.entries(Events).find( Event => Event[0] === id /*id*/)
        navigation.navigate('Event Details', { Event });
    };

    return (
        <SafeAreaView>
            <Button onPress={() => handleLogOut()} title="Log out" />
            <Text>
                Current user: {firebase.auth().currentUser.email}
            </Text>

            <Text style={styles.label}> Events that i am participating in: </Text>
            <FlatList
                data={eventArray}
                // Bruger event ID til at finde det rigtige event og returnere det.
                keyExtractor={(item, index) => eventId[index]}
                renderItem={({ item, index }) => {
                    return(
                        <TouchableOpacity style={styles.container} onPress={() => handleSelectEvent(eventId[index])}>
                            <View>
                                <Text style={styles.label}>
                                    Name of the event: {/*item.Name*/}
                                </Text>
                                <Text>
                                    Time and date: {item.Time}
                                </Text>
                                <Text>
                                    Location: {item.Location}
                                </Text>

                                <Image source={{ uri: item.Image }} style={{ width: '100%', height: 150}} />
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </SafeAreaView>
    )
}
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius:1,
        margin: 5,
        padding: 5,
        justifyContent:'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: 'hidden',
        backgroundColor: "#ffff",
        borderColor:"#4db5ac"
    },
    label: { fontWeight: 'bold', color:"#6e5e47",
    },
});

