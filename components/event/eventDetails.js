import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert,Image } from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";
import Map from "./Map";

const EventDetails = ({route,navigation}) => {
    const [Event,setEvent] = useState({});
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [eventParticipation, seteventParticipation] = useState(false)

    useEffect(() => {
        // Finder values for events og sætter dem ind.
        setEvent(route.params.Event[1]);
        const found = (Object.entries(Event)
            .find(pair => pair[0] === 'userMarkerCoordinates'));

        if(found != null)
            {
                if(route.params.Event[2] !== undefined) {
                    setUserMarkerCoordinates(route.params.Event[2]);
                } else {

                    setUserMarkerCoordinates(found[1]);
                }
            }
        //Find if the user is already participating in this event.
            firebase.database().ref(`userEvents`).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).on("value", function(snapshot) {
                if (snapshot.exists()) {
                    console.log("UE - EventDetail")
                    const eventId = Object.values(snapshot.val())[0].eventId;
                    eventId.indexOf(route.params.Event[0]) === -1 ? seteventParticipation(false) : seteventParticipation(true);

                }
            });
            // Når man forlader det view, skal værdierne være tomme.
        return () => {
            setEvent({})
        }
    });

    const handleEdit = () => {
        // Man går videre til edit event view og sender alt det data from event man har valgt at redigere med.
        const Usersend = userMarkerCoordinates;
        const Event = [route.params.Event, Usersend]
        navigation.navigate('Edit Event', { Event });
    };

    // Vi spørger brugeren om han er sikker
    const confirmDelete = () => {
        // Laver en alert besked hvor der står om man er sikker på at eventet skal slettes.
        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            Alert.alert('Are you sure?', 'Do you want to delete this event?', [
                { text: 'Cancel', style: 'cancel' },
                // Eventet bliver slettet når der trykkes på delete.
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    };

    // Eventet slettes.
    const  handleDelete = () => {
        const id = route.params.Event[0];
        try {
            firebase
                .database()
                // Eventets ID sættes ind.
                .ref(`/Events/${id}`)
                // Eventets data fjernes.
                .remove();
            // Går tilbage når det er udført.
            navigation.goBack();
        } catch (error) {
            Alert.alert(error.message);
        }
    };


    if (!Event) {
        return <Text>You have no upcoming events!</Text>;
    }

    const renderElements = (item) => {
        if(item[0] === 'filePath')
        {
            return <Image source={{ uri: item[1] }} style={{ width: '100%', height: 150}} />
        } else if(item[0] === 'userMarkerCoordinates'){
            return null
        }else if(item[0] === 'user'){
            return null
        }else if(item[0] === 'Image') {
            return null
        } else {
            return <Text style={styles.value}>{item[1]}</Text>
        }
    }
//.orderByChild('name').equalTo('John Doe').on("value", function(snapshot) {
    const confirmDeltag = async () =>  {
        console.log("Pressed Confirm deltag");
        console.log(route);
        try {
             await firebase.database().ref(`userEvents`).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once("value", function(snapshot) {
                 if (snapshot.exists()){
                     console.log("Inside snapshop")
                     const id = Object.keys(snapshot.val())[0];
                     //const event1 = Object.values(snapshot.val())[0].event;
                     const eventId = Object.values(snapshot.val())[0].eventId;

                     //const event = event1.concat(Event);
                     //const eventId =  [route.params.Event[0]].concat(eventId1);
                     eventId.indexOf(route.params.Event[0]) === -1 ? eventId.push(route.params.Event[0]) : console.log("This item already exists");
                     console.log("Ipdate: eventId");
                     console.log(eventId);
                     firebase
                      .database()
                         .ref(`/userEvents/${id}`)
                         // Updatet bruges til at opdatere kun de felter som er blevet ændret.
                         .update({ eventId}).then();
                     //navigation.goBack();

                } else {
                    const userId = firebase.auth().currentUser.uid;
                    const event = [Event];
                    const eventId = [route.params.Event[0]];

                    firebase
                        .database()
                        .ref('/userEvents/')
                        .push({ userId, eventId});
                     //navigation.goBack();

                 }

            }).then();

        } catch (error) {
            Alert.alert(error.message);
        }
    }

    // Returnerer et event som er allerede oprettet så det kan redigeres eller slettes.
    return (
        <View style={styles.container}>

            {
                Object.entries(Event).map((item,index)=>{
                    return(
                        <View style={styles.row} key={index}>
                            {(item[0] === 'userMarkerCoordinates' || item[0] === 'user' || item[0] === 'filePath' || item[0] === 'Image' ) ? null : <Text style={styles.label}>{item[0]} </Text>}
                            {renderElements(item)}
                        </View>
                    )
                })
            }
            <Map userMarkerCoordinatesParent={userMarkerCoordinates} isEditEvent={true}/>
            <Text></Text>
            {(firebase.auth().currentUser.uid !== Event.user) ? null : <Button title="Edit" onPress={ () => handleEdit()} color={"#4db5ac"} />}
            <Text></Text>
            {(firebase.auth().currentUser.uid !== Event.user) ? null : <Button title="Delete" onPress={() => confirmDelete()} color={"#4db5ac"}/>}
            <Text></Text>
            {(eventParticipation) ? <Text> you are participating this event</Text> : <Button title="Deltag" onPress={() => confirmDeltag()} color={"#4db5ac"}/>}

        </View>
    );
}
//(item[0] ==='Image') ? Image source={{ uri: item.Image }} style={{ width: '100%', height: 150}} /> : <Text> </Text>
export default EventDetails;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start', borderColor: "#4db5ac", flex: 1,
        borderWidth: 1,
        borderRadius: 1,
        margin: 5,
        padding: 5,
        height: 100,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: 'hidden',
        backgroundColor: "#ffff"
    },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold', color:"#6e5e47"},
    value: { flex: 1, color:"#6e5e47" },
});