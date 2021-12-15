import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    SafeAreaView,
    Image,
} from 'react-native';
import firebase from 'firebase';
import {useEffect, useRef, useState} from "react";
import Map from "./Map";
import Picker from "./Picker";
import { images } from "../../assets"

const add_edit_event = ({navigation,route}) => {
    const initialState = {
       Name: '',
        Location: '',
        Time:"",
        Description:"",
        Image:"",
    }
    //Setting states
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [newEvent,setNewEvent] = useState(initialState);
    const [currentFilepath,setCurrentFilepath] = useState("");
    const [uploading, setUploading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    // Check where the event came from
    const isEditEvent = route.name === "Edit Event";

    const childRef = useRef()
    //Helper function
    function removeItemOnce(arr, value) {
        const index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
    //Used when getting a callback from Map. Adds to the array of markers
    const callbackAdd = (coordinates) => {
        for (let i = 0; i < userMarkerCoordinates.length; i++) {
        }
        setUserMarkerCoordinates((oldArray) => [...oldArray, coordinates]);
    }
    //Used when getting a callback from Map. removes from the array of markers
    const callbackRemove = (coordinates) => {
        removeItemOnce(userMarkerCoordinates, coordinates);

    }
    //Setting states if navigation comes from edit event
    useEffect(() => {
        if(isEditEvent){
            const Event = route.params.Event[0][1];
            setNewEvent(Event)
            //Setting the map-markers of the event
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
            //Setting the current filepath
            setCurrentFilepath(Event.filePath);
        }
        // Data gets removed when going to another view
        return () => {
            setNewEvent(initialState)
        };
    }, []);

    // Changes the event
    const changeTextInput = (name,event) => {
        setNewEvent({...newEvent, [name]: event});
    }
    //Getting the Blob of the image the user has picked
    const getPictureBlob = async(uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
    };
    //Uploads the picture to firebase storage
    const handleUpload = async(uri, name) => {
        let blob;
        let storage = firebase.storage();
        try {
            setUploading(true);
            blob = await getPictureBlob(uri);
            const ref = await storage.ref().child('folder/' + name);
            const snapshot = await ref.put(blob);
            return await snapshot.ref.getDownloadURL();
        } catch (e) {
            alert("Please Select a Photo First");
            setUploading(false);
        } finally {
            blob.close();
            setUploading(false);
        }

    }

    // Setting the current filepath
    const getFilepath = async(uri) =>
    {
       setCurrentFilepath(uri);
    }

    // Save the new event
    const handleSave = async() => {
        setDisableButton(true);

        const { Name, Location, Time, Description, Image} = newEvent;
        // Check if any fields are empty
        if(Name.length === 0 || Location.length === 0 || Time.length === 0 || Description.length === 0 || currentFilepath.length === 0){
            return Alert.alert('Du har ikke udfyldt alle felterne!');
        }
        //Uploads the picture to firebase Storage
        let filePath = await handleUpload(currentFilepath, Name);
        //Checks if we are editing an event or creating it.
        if(isEditEvent){
            const id = route.params.Event[0][0];
            try {
                //Update event in firebase
                firebase
                    .database()
                    .ref(`/Events/${id}`)
                    // Updatet bruges til at opdatere kun de felter som er blevet ændret.
                    .update({ Name, Location, Time, Description,Image,userMarkerCoordinates, filePath}).then(() =>
                {
                    const UserSend = userMarkerCoordinates;
                    const newFilePath = filePath;
                    const Event = [id,newEvent, UserSend,newFilePath]
                    Alert.alert("Eventet er opdateret");
                    setDisableButton(false);
                    //Navigate back to Event details
                    navigation.navigate("Event Details",{Event});
                });

            } catch (error) {
                console.log(`Error: ${error.message}`);
            }

        }else{
            try {
                //Creates a new event
                const user = firebase.auth().currentUser.uid;
                firebase
                    .database()
                    .ref('/Events/')
                    .push({ Name, Location, Time, Description,Image, userMarkerCoordinates,user, filePath}).then(()=>{
                    childRef.current.reset();
                    Alert.alert(`Dit event er gemt`);
                    //Removes all data
                    setNewEvent(initialState)
                    setUserMarkerCoordinates([]);
                    setCurrentFilepath("");
                    setDisableButton(false);
                });


            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }

    };

    const ImageUri = (currentFilepath.length !== 0 ) ? {uri:currentFilepath} : "";

    return (
        <SafeAreaView style={styles.container}>
                {
                    Object.keys(initialState).map((key,index) =>{
                        return(
                            <View style={styles.row} key={index}>
                                {(key === "Image") ? <Text> </Text> : <Text style={styles.label}>{key}</Text> }
                                {(key === "Image") ? <Text> </Text>  : <TextInput
                                    value={newEvent[key]}
                                    onChangeText={(event) => changeTextInput(key,event)}
                                    style={styles.input}
                                /> }
                            </View>
                        )
                    })
                }
            <Text style={styles.label2}> Add Picture for event</Text>
            <Image source={ (currentFilepath.length !== 0) ? ImageUri : images.image } style={{ width: '60%', height: '20%'}} />
            <Picker getFilepath={getFilepath} style={styles.picks}/>
            <Text style={styles.label2}> Pick location: </Text>
            <Map ref={childRef} parentCallback={callbackAdd}  parentRemoveCallback={callbackRemove} userMarkerCoordinatesParent={userMarkerCoordinates} isEditEvent={false} style={styles.maps}/>

            <Button title={ isEditEvent ? "Gem ændringer" : "Tilføj Event"} onPress={() => handleSave()} color={"#4db5ac"} disabled={disableButton} />

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
        overflow: 'hidden',
        backgroundColor: "#ffff",
        borderColor:"#4db5ac",
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 15,
        marginBottom: -5,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#4db5ac',
    },
    label: {
        fontWeight: 'bold',
        width: 100,
        color:"#6e5e47"
    },
    label2: {
        fontWeight: 'bold',
        color:"#6e5e47",
        textAlign: 'center',
        padding: 3,
    },
    input: {
        borderWidth: 1,
        padding: 5,
        flex: 1
    },

    picks:
        {
        },
    maps: {
        position: 'absolute',
    },
});
