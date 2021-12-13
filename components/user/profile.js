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

    const [isFocused, setIsFocused] = useState(true);
    const [Events,setEvents1] = useState([]);
    const [no_of_events,setNo_of_events] = useState(0);
    const [firstRender,setFirstRender] = useState(true);
    //const [no_of_events,setNo_of_events] = useState(0);
    const [loading, setLoading] = useState(false);
    const [timesloading, setTimesLoading] = useState(0);
    const [eventListId, setEventListId] = useState([]);

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
                                    fetchedTasks.push([id, data.val()]);
                                    if(index === (eventId.length-1))
                                        {
                                            setEvents1(fetchedTasks);
                                        }
                                    })
                        }));
                    }
                });
               return () => console.log("return");
            },[])
            );

    let eventArray = Object.values(Events);
    let eventId = Object.keys(Events);


    if (Events.length < 1) {
        return(<View>
            <Text>You have no upcoming events</Text>

        </View>);
    };

    if(eventArray.length !== no_of_events)
    {
        return <Text>loading</Text>;
    };

    const handleSelectEvent = Event => {
        navigation.navigate('Event Details', {Event});
    };


    return (
        <SafeAreaView style={{flex: 1}}>
            <Button onPress={() => handleLogOut()} title="Log out" />
            <Text>
                Current user: {firebase.auth().currentUser.email}
            </Text>
            <Text style={styles.label}> Events that i am participating in: </Text>
            <FlatList
                data={eventArray}
                keyExtractor={(item, index) => eventArray[index][0]}
                renderItem={({ item, index }) => {
                    console.log(item[0]);
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

                                <Image source={{ uri: item[1].filePath }} style={{ width: '100%', height: 150}} />
                            </View>
                        </TouchableOpacity>

                    )
                }}
            />
            <Text> HI </Text>
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

