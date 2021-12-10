import {Button, Text, SafeAreaView, TouchableOpacity, View, Image, FlatList, StyleSheet} from "react-native";
import firebase from "firebase";
import React, {useEffect, useState} from "react";
import add_edit_event from "../event/add_edit_event";
import {useIsFocused} from "@react-navigation/native";

// brugerens egen side, kan tilgås når der er logget ind og viser abonnerede begivenheder?
// evt også begivenheder man selv har oprettet?
// skal føre til login siden hvis ikke man er logget ind? altså const StartScreen fra App.js

const Profile = ({navigation,route}) => {
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    const [isFocused, setIsFocused] = useState(true);
    const [Events,setEvents1] = useState([]);
    const [no_of_events,setNo_of_events] = useState(0);

    useEffect(() => {
        console.log("Beginning use effect");
        setEvents1([]);
        if(Events.length < 1) {
            firebase.database()
                .ref(`userEvents`)
                .orderByChild('userId')
                .equalTo(firebase.auth().currentUser.uid)
                .on("value", function(snapshot) {
                    if (snapshot.exists()){
                        const eventId = Object.values(snapshot.val())[0].eventId;
                        console.log("EventIds");
                        console.log(eventId);
                        setEvents1([]);
                        console.log("Events");
                        console.log(Events);
                        setNo_of_events(eventId.length);
                        eventId.map((id =>
                        {
                            firebase
                                .database()
                                // Eventets ID sættes ind.
                                .ref(`/Events/${id}`)
                                // Eventets data fjernes.
                                .on('value', snapshot => {
                                if(snapshot.exists()) {
                                    console.log("Something here?");
                                    //setEvents1([...Events, [id, snapshot.val()]]);
                                    setEvents1((oldArray) => [...oldArray, [id, snapshot.val()]]);
                                } else
                                {
                                    console.log('Does not exist');
                                }
                                });
                        }));

                        console.log("events")
                        console.log(Events);
                    }
                });
            }
        return () => {
            setEvents1([]);
            //setIsFocused(!isFocused);
            console.log("retruned");
            // Perhaps this is the solution: https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks
        };
    },[isFocused]);

    const eventArray = Object.values(Events);
    const eventId = Object.keys(Events);

    if (Events.length < 1) {
        return <Text>You have no upcoming events</Text>;
    }
    if(eventArray.length !== no_of_events)
    {
        console.log("inside is focused changes");
        console.log(no_of_events);
        console.log(eventArray.length);
        setIsFocused(!isFocused);
    }

    console.log(eventId);


    const handleSelectEvent = Event => {
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
                        <TouchableOpacity style={styles.container} onPress={() => handleSelectEvent([item[0], item[1]])}>
                            <View>
                                <Text style={styles.label}>
                                    Name of the event: {item[1].Name}
                                </Text>
                                <Text>
                                    Time and date: {item[1].Time}
                                </Text>
                                <Text>
                                    Location: {item[1].Location}
                                </Text>

                                <Image source={{ uri: item[1].Image }} style={{ width: '100%', height: 150}} />
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

