import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";

// Her oprettes der en funktion som søger for events i firebase.
const EventList = ({navigation}) => {

    const [Events,setEvents] = useState()

    //Getting all the events from the database
    useEffect(() => {
        if(!Events) {
            firebase
                .database()
                .ref('/Events')
                .on('value', snapshot => {
                    setEvents(snapshot.val())
                });
        }
    },[]);

// If there are no events, just show that there are no upcoming events
    if (!Events) {
        return <Text>You have no upcoming events</Text>;
    }


    // find the selected event, and navigate to details
    const handleSelectEvent = id => {
        const Event = Object.entries(Events).find( Event => Event[0] === id /*id*/)
        navigation.navigate('Event Details', { Event});
    };

    const eventArray = Object.values(Events);
    const eventId = Object.keys(Events);

    return (
        <FlatList
            data={eventArray}
            keyExtractor={(item, index) => eventId[index]}
            renderItem={({ item, index }) => {
                return(
                    <TouchableOpacity style={styles.container} onPress={() => handleSelectEvent(eventId[index])}>
                        <View>
                            {((firebase.auth().currentUser.uid !== item.user) ? null : <Text style={styles.yourLabel}> YOUR EVENT </Text> )}
                            <Text style={styles.label}>
                                {item.Name}
                            </Text>
                            <Text>
                                Tidspunkt: {item.Time}
                            </Text>
                            <Text>
                                Lokation: {item.Location}
                            </Text>

                            <Image source={{ uri: item.filePath }} style={{ width: '100%', height: 150}} />
                        </View>
                    </TouchableOpacity>
                )
            }}
        />
    );
}

export default EventList;

// Styling.
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
    label: { fontWeight: 'bold', color:"#6e5e47", textAlign:"center"
    },
    yourLabel:
        {
            fontWeight: 'bold',
            color:"#ec6e35",
            textAlign: "center",
        }

});