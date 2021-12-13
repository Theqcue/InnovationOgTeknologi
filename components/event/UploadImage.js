import React, { useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    Image, Button
} from 'react-native';
import firebase from "firebase";

export default function UploadImage() {
    const [image, setImage] = useState(null);
    //const [uploading, setUploading] = useState(false);
    const [downloadURL, setDownloadURL] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
         console.log(e.target.files[0])
    }

    const handleUpload = () =>{
        console.log(image);
        let file = image;
        let storage = firebase.storage();
        let storageRef = storage.ref();
        let uploadTask = storageRef.child('folder/' + file.name).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) =>{
                var progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100
                setProgress({progress})
            },(error) =>{
                throw error
            },() =>{
                // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{

                uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
                    setDownloadURL(url)
                })
                document.getElementById("file").value = null

            }
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <div className="App">
                <h4>upload image</h4>
                <Text>
                    Choose file</Text>

                <Input type="file" id="file" onChange={handleChange} />


                {progress}
                <Button className="button" onClick={handleUpload}>Upload</Button>
                <Image
                    className="ref"
                    src={downloadURL || "https://via.placeholder.com/400x300"}
                    alt="Uploaded Images"
                    height="300"
                    width="400"
                />
            </div>
        </SafeAreaView>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#bbded6'
    },
    selectButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: '#8ac6d1',
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: '#ffb6b9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center'
    },
    progressBarContainer: {
        marginTop: 20
    },
    imageBox: {
        width: 300,
        height: 300
    }
});