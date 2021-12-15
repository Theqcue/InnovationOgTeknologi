import {Button, Text, SafeAreaView, TouchableOpacity, View, Image, FlatList, StyleSheet} from "react-native";
import firebase from "firebase";
import React, {useEffect, useState} from "react";
import add_edit_event from "../event/add_edit_event";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";

// brugerens egen side, kan tilgås når der er logget ind og viser abonnerede begivenheder?
// evt også begivenheder man selv har oprettet?
// skal føre til login siden hvis ikke man er logget ind? altså const StartScreen fra App.js

const Profile = ({navigation,route}) => {
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    const [Events,setEvents1] = useState([]);
    const [no_of_events,setNo_of_events] = useState(0);

    //Getting all the events that the user is participating in
            useFocusEffect(
                React.useCallback(() => {
                firebase.database()
                        .ref(`userEvents`)
                        .orderByChild('userId')
                        .equalTo(firebase.auth().currentUser.uid)
                        .once("value", function (snapshot) {
                        }).then((data) => {
                    if (data.exists()) {
                        const fetchedTasks = [];
                        const eventId = Object.values(data.val())[0].eventId;
                        setNo_of_events(eventId.length);
                        eventId.map(( (id, index) => {
                            firebase.database().ref(`/Events/${id}`)
                                .once('value', dataSnapshot  => {

                                    }).then((data) => {
                                    if(data.exists()) {
                                    fetchedTasks.push([id, data.val()]);
                                    if(index === (eventId.length-1))
                                        {
                                            setEvents1(fetchedTasks);
                                        }
                                    }
                                    });

                        }));
                    }
                });
               return () => setEvents1([]);
            },[])
            );


            let eventArray = Object.values(Events);

//You are now currently attending any events message
    if (Events.length < 1) {
        return(
        <View style={styles.container}>
            <Text style={styles.labelT}>Du deltager ikke i nogen events</Text>
            <Text style={styles.labelTop}>
                Bruger: {firebase.auth().currentUser.email}
            </Text>
            <Button onPress={() => handleLogOut()} title="Log ud" />
        </View>);
    };

    //The screen is still loading
    if(eventArray.length !== no_of_events)
    {
        return <Text>loading</Text>;
    };

    //Navigate to event details
    const handleSelectEvent = Event => {
        navigation.navigate('Event Details', {Event});
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <Text style={styles.labelT}> Mine Events </Text>
            <FlatList
                data={eventArray}
                keyExtractor={(item, index) => eventArray[index][0]}
                renderItem={({ item, index }) => {

                    return(
                        <TouchableOpacity style={styles.container} onPress={() => handleSelectEvent([item[0], item[1]])}>
                            <View>
                                <Text style={styles.label}>
                                    {item[1].Name}
                                </Text>
                                <Text>
                                    Tidspunkt: {item[1].Time}
                                </Text>
                                <Text>
                                    Lokation: {item[1].Location}
                                </Text>

                                <Image source={{ uri: item[1].filePath }} style={{ width: '100%', height: 150}} />
                            </View>
                        </TouchableOpacity>

                    )
                }}
            />
            <Text style={styles.labelTop}>
                Bruger: {firebase.auth().currentUser.email}
            </Text>
            <Button onPress={() => handleLogOut()} title="Log ud" />
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
    label: {
        fontWeight: 'bold',
        textAlign:"center",

    },
    labelT: {
        fontWeight: 'bold',
        color:"#ec6e35",
        textAlign:"center",

    }, labelTop: {
        fontWeight: 'bold',
        color:"#6e5e47",
        textAlign:"center",
        fontStyle: "italic",

    },


});

