import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert,Image, ScrollView,SafeAreaView  } from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";
import Map from "./Map";

const EventDetails = ({route,navigation}) => {
    const [Event,setEvent] = useState({});
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [filePath, setFilePath] = useState("")
    const [eventParticipation, seteventParticipation] = useState(false)

    //Sets the states, with the information in the specific event.
    useEffect(() => {
        setEvent(route.params.Event[1]);
        const found = (Object.entries(Event)
            .find(pair => pair[0] === 'userMarkerCoordinates'));

        if(typeof (route.params.Event[3]) !== 'undefined' )
        {
            setFilePath(route.params.Event[3]);
        }
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
                    const eventId = Object.values(snapshot.val())[0].eventId;
                    eventId.indexOf(route.params.Event[0]) === -1 ? seteventParticipation(false) : seteventParticipation(true);

                }
            });
            // set empty event when leaving the view
        return () => {
            setEvent({})
        }
    });

    //Navigate to edit event
    const handleEdit = () => {
        // Man går videre til edit event view og sender alt det data from event man har valgt at redigere med.
        const Usersend = userMarkerCoordinates;
        const Event = [route.params.Event, Usersend]
        navigation.navigate('Edit Event', { Event });
    };

    if (!Event) {
        return <Text>You have no upcoming events!</Text>;
    }
    //Render page, with correct labels in danish
    const renderElements2 = (item) => {
        if(item[0] === 'filePath')
        {
        } else if(item[0] === 'userMarkerCoordinates'){
            return null
        }else if(item[0] === 'user'){
            return null
        }else if(item[0] === 'Image') {
            return null
        } else if(item[0] === 'Description') {
            return(<Text style={styles.label}>Beskrivelse</Text>)

        }else if(item[0] === 'Location') {
            return <Text style={styles.label}> Lokation: </Text>

        }else if(item[0] === 'Name') {
            return <Text style={styles.label}>Navn: </Text>

        }else if(item[0] === 'Time') {
            return<Text style={styles.label}>Tid: </Text>
        }
    }
    const renderElements = (item) => {
        if(item[0] === 'filePath')
        {
            if(filePath.length > 0) {
                return <Image source={{uri: filePath}} style={{width: '100%', height: 150}}/>
            } else {
                return <Image source={{uri: item[1]}} style={{width: '100%', height: 150}}/>
            }
        } else if(item[0] === 'userMarkerCoordinates'){
            return null
        }else if(item[0] === 'user'){
            return null
        }else if(item[0] === 'Image') {
            return null
        } else if(item[0] === 'Description') {
            return(<Text style={styles.value}>{item[1]}</Text>)

        }else if(item[0] === 'Location') {
            return <Text style={styles.value}>{item[1]}</Text>

        }else if(item[0] === 'Name') {
            return <Text style={styles.value}>{item[1]}</Text>

        }else if(item[0] === 'Time') {
            return <Text style={styles.value}>{item[1]}</Text>
        }

    }
    // Update database that you are attending this event. If person has not attended anything before create a userEvent, else update user event with new event.
    const confirmDeltag =  () =>  {
        try {
            firebase.database().ref(`userEvents`).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once("value", function(snapshot) {
            }).then((snapshot) => {
                if (snapshot.exists()){
                    const id = Object.keys(snapshot.val())[0];
                    const eventId = Object.values(snapshot.val())[0].eventId;

                    eventId.indexOf(route.params.Event[0]) === -1 ? eventId.push(route.params.Event[0]) : console.log("This item already exists");
                    firebase
                        .database()
                        .ref(`/userEvents/${id}`)
                        // Updatet bruges til at opdatere kun de felter som er blevet ændret.
                        .update({ eventId}).then();
                } else {
                    const userId = firebase.auth().currentUser.uid;
                    const event = [Event];
                    const eventId = [route.params.Event[0]];

                    firebase
                        .database()
                        .ref('/userEvents/')
                        .push({ userId, eventId});
                }
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.thisview}>
                <ScrollView >

            {
                Object.entries(Event).map((item,index)=>{
                    return(
                        <View style={styles.row} key={index}>
                            {renderElements2(item)}
                            {renderElements(item)}
                        </View>
                    )
                })
            }
                </ScrollView>
            </View>

            <Map userMarkerCoordinatesParent={userMarkerCoordinates} isEditEvent={true}/>
            <Text></Text>
            {(firebase.auth().currentUser.uid !== Event.user) ? null : <Button title="Rediger" onPress={ () => handleEdit()} color={"#4db5ac"} />}
            <Text></Text>
            {(eventParticipation) ? <Text> Du deltager allerede i dette event</Text> : <Button title="Deltag" onPress={() => confirmDeltag()} color={"#4db5ac"}/>}



        </SafeAreaView>
    );
}

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
    thisview:
        {
        height: 350,
    },

});