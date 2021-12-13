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
    Image,
    TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import {useEffect, useRef, useState} from "react";
import Map from "./Map";
import UploadImage from "./UploadImage";
import Picker from "./Picker";
import { images } from "../../assets"

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
    const [filepath,setfilepath] = useState("");
    const [currentFilepath,setCurrentFilepath] = useState("");
    const [downloadURL, setDownloadURL] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

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
            setCurrentFilepath(Event.filePath);
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
    const getPictureBlob = async(uri) => {
        //console.log(uri);
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
            //setUpdate(false);
        } finally {
            blob.close();
            setUploading(false);
            //setUpdate(false);
            //alert("saved successfully");
        }


       /* let file = uri;
        let storage = firebase.storage();
        let storageRef = storage.ref();
        let uploadTask = storageRef.child('folder/' + file.name).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) =>{
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100
                setProgress({progress})
                console.log("progress");
                console.log(progress);
            },(error) =>{
                throw error
            },() =>{
                // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{

                uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
                    setDownloadURL(url);
                    console.log("url");
                    console.log(url);
                })
                //document.getElementById("file").value = null

            }
        )*/
    }

    // get filepath
    const getFilepath = async(uri) =>
    {
        //console.log("add_edit_event filepath");
        //console.log(uri);
       setCurrentFilepath(uri);

    }




    // Gemmer disse oplysninger.
    const handleSave = async() => {
        setDisableButton(true);

        const { Name, Location, Time, Description, Image} = newEvent;
        // Tjekker om felterne er tomme.
        if(Name.length === 0 || Location.length === 0 || Time.length === 0 || Description.length === 0 || currentFilepath.length === 0){
            return Alert.alert('You did not fill out one of the inputs!');
        }
        let filePath = await handleUpload(currentFilepath, Name);
        //setfilepath(imgURL);
        if(isEditEvent){
            const id = route.params.Event[0][0];
            try {
                firebase
                    .database()
                    .ref(`/Events/${id}`)
                    // Updatet bruges til at opdatere kun de felter som er blevet ændret.
                    .update({ Name, Location, Time, Description,Image,userMarkerCoordinates, filePath}).then(() =>
                {
                    const UserSend = userMarkerCoordinates;
                    const newFilePath = filePath;
                    const Event = [id,newEvent, UserSend,newFilePath]
                    Alert.alert("Your event has been updated");
                    setDisableButton(false);
                    navigation.navigate("Event Details",{Event});
                });

            } catch (error) {
                console.log(`Error: ${error.message}`);
            }

        }else{
            try {
                const user = firebase.auth().currentUser.uid;
                firebase
                    .database()
                    .ref('/Events/')
                    .push({ Name, Location, Time, Description,Image, userMarkerCoordinates,user, filePath}).then(()=>{
                    childRef.current.reset();
                    Alert.alert(`Saved`);
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



            <Button title={ isEditEvent ? "Save changes" : "Add Event"} onPress={() => handleSave()} color={"#4db5ac"} disabled={disableButton} />

         </SafeAreaView>

    );
}
/*
            <TouchableOpacity disabled={{disableButton}} onPress={() => handleSave()} color={"#4db5ac"} style={styles.button}>
                <Text>{ isEditEvent ? "Save changes" : "Add Event"}</Text>
            </TouchableOpacity>

*            {(currentFilepath.length !== 0) ?<Image source={{ uri: currentFilepath }} style={{ width: '50%', height: 150}} /> :  <Image style={styles.avatarImage} source= images.avatar/>}
         <Button title={ isEditEvent ? "Save changes" : "Add Event"} onPress={() => handleSave()} color={"#4db5ac"} />

*                 <Map ref={childRef} parentCallback={callbackAdd}  parentRemoveCallback={callbackRemove} userMarkerCoordinatesParent={userMarkerCoordinates} isEditEvent={false}/>
                <Button title={ isEditEvent ? "Save changes" : "Add Event"} onPress={() => handleSave()} color={"#4db5ac"} />
 <UploadImage/>
* * */

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
        //borderBottomLeftRadius: 5,
        //borderBottomRightRadius: 5,
        //borderTopLeftRadius: 5,
        //borderTopRightRadius: 5,
        overflow: 'hidden',
        backgroundColor: "#ffff",
        borderColor:"#4db5ac",
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 15,
        //padding: 5,
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
            //left: '70%',
            //bottom: '145%',
        },
    maps: {
        position: 'absolute',
        //flex: 1,
        //backgroundColor: 'black',
        //bottom:'50%',
    },


});
