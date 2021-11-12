import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert } from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";

const EventDetails = ({route,navigation}) => {
    const [Event,setEvent] = useState({});

    useEffect(() => {
        // Finder values for events og sætter dem ind.
        setEvent(route.params.Event[1]);

        // Når man forlader det view, skal værdierne være tomme.
        return () => {
            setEvent({})
        }
    });

    const handleEdit = () => {
        // Man går videre til edit event view og sender alt det data from event man har valgt at redigere med.
        const Event = route.params.Event
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

    // Returnerer et event som er allerede oprettet så det kan redigeres eller slettes.
    return (
        <View style={styles.container}>

            {
                Object.entries(Event).map((item,index)=>{
                    return(
                        <View style={styles.row} key={index}>
                            <Text style={styles.label}>{item[0]} </Text>
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    )
                })
            }
            <Text></Text>
            <Button title="Edit" onPress={ () => handleEdit()} color={"#4db5ac"} />
            <Text></Text>
            <Button title="Delete" onPress={() => confirmDelete()} color={"#4db5ac"}/>
        </View>
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
});