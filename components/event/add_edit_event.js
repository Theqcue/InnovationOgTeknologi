import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import firebase from 'firebase';
import {useEffect, useRef, useState} from "react";
import Map from "./Map";

// Hvilke felter skal eventet indeholde?
const add_edit_event = ({navigation,route}) => {

    const initialState = {
       Name: '',
        Location: '',
        Time:"",
        Description:"",
        Image:"",
    }
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [newEvent,setNewEvent] = useState(initialState);

    // Tjekker og returnerer true hvis vi er i Edit Event felt.
    const isEditEvent = route.name === "Edit Event";

    const childRef = useRef()

    function removeItemOnce(arr, value) {
        const index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
    const callbackAdd = (coordinates) => {
        for (let i = 0; i < userMarkerCoordinates.length; i++) {
        }
        setUserMarkerCoordinates((oldArray) => [...oldArray, coordinates]);
    }

    const callbackRemove = (coordinates) => {
        removeItemOnce(userMarkerCoordinates, coordinates);

    }

    const success = (state, { payload }) => {
        const newArr = state.payload.concat(payload)
        const idPositions = newArr.map(el => el.id)
        const newPayload = newArr.filter((item, pos, arr) => {
            return idPositions.indexOf(item.id) == pos;
        })

        return state.merge({ payload: newPayload })
    }

    useEffect(() => {
        if(isEditEvent){
            const Event = route.params.Event[0][1];
            setNewEvent(Event)
            const found = (Object.entries(Event)
                .find(pair => pair[0] === 'userMarkerCoordinates'));
            if(found != null)
            {
                if(route.params.Event[0][2] !== undefined) {
                    setUserMarkerCoordinates    (route.params.Event[0][2]);
                } else {
                    setUserMarkerCoordinates(found[1]);
                }
            }
        }
        // Data fjernes når man går til et andet view.
        return () => {
            setNewEvent(initialState)
        };
    }, []);

    // Ændrer event oplysninger.
    const changeTextInput = (name,event) => {
        setNewEvent({...newEvent, [name]: event});
    }
     // Gemmer disse oplysninger.
    const handleSave = () => {


        const { Name, Location, Time, Description, Image} = newEvent;
        // Tjekker om felterne er tomme.
        if(Name.length === 0 || Location.length === 0 || Time.length === 0 || Description.length === 0 ){
            return Alert.alert('You did not fill out one of the inputs!');
        }

        if(isEditEvent){
            const id = route.params.Event[0][0];
            try {
                firebase
                    .database()
                    .ref(`/Events/${id}`)
                    // Updatet bruges til at opdatere kun de felter som er blevet ændret.
                    .update({ Name, Location, Time, Description,Image,userMarkerCoordinates});
                // Når eventet er opdateret går man tilbage til det forrige view.
                const UserSend = userMarkerCoordinates
                const Event = [id,newEvent, UserSend]
                Alert.alert("Your event has been updated");
                navigation.navigate("Event Details",{Event});
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }

        }else{
            try {
                const user = firebase.auth().currentUser.uid;
                firebase
                    .database()
                    .ref('/Events/')
                    .push({ Name, Location, Time, Description,Image, userMarkerCoordinates,user});
                childRef.current.reset();
                Alert.alert(`Saved`);
                setNewEvent(initialState)
                setUserMarkerCoordinates([]);

            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }

    };
    return (
        <SafeAreaView style={styles.container}>
                {
                    Object.keys(initialState).map((key,index) =>{
                        return(
                            <View style={styles.row} key={index}>
                                <Text style={styles.label}>{key}</Text>
                                <TextInput
                                    value={newEvent[key]}
                                    onChangeText={(event) => changeTextInput(key,event)}
                                    style={styles.input}
                                />
                            </View>
                        )
                    })
                }
                <Text> Pick location: </Text>

                <Map ref={childRef} parentCallback={callbackAdd}  parentRemoveCallback={callbackRemove} userMarkerCoordinatesParent={userMarkerCoordinates} isEditEvent={false}/>
                <Button title={ isEditEvent ? "Save changes" : "Add Event"} onPress={() => handleSave()} color={"#4db5ac"} />
        </SafeAreaView>
    );
}

export default add_edit_event;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius:1,
        margin: 5,
        padding: 5,
        height: 100,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: 'hidden',
        backgroundColor: "#ffff",
        borderColor:"#4db5ac"
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,

    },
    label: {
        fontWeight: 'bold',
        width: 100,
        color:"#6e5e47"
    },
    input: {
        borderWidth: 1,
        padding: 5,
        flex: 1
    }
});
