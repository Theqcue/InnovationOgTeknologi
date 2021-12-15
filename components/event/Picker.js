import React, {useState, useCallback, useEffect} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View, Text, Button} from 'react-native';
//import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerModal} from "./ImagePicker";
import {images} from "../../assets";

export default function Picker({getFilepath}) {
    const [pickerResponse, setPickerResponse] = useState(null);
    const [visible, setVisible] = useState(false);
    const [image, setImage] = useState(null);

    //Checking if camara permissions are granted
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    //Picking the image - launching the Library
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setPickerResponse(result.uri);
            getFilepath(result.uri);
        }
    };

    //Taking a new picture - lanuching camara
    const onCameraPress = async ()=>{
        const {granted} =  await ImagePicker.requestCameraPermissionsAsync();
        if(granted){
            let data =  await ImagePicker.launchCameraAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.Images,
                allowsEditing:true,
                aspect:[1,1],
                quality:0.5
            })
            if(!data.cancelled){
                const newfile = {
                    uri:data.uri,
                }
                setPickerResponse(newfile.uri);
                getFilepath(newfile.uri);
            }
        }else{
            Alert.alert("Du skal give adgang til at vælge billeder")
        }
    }

    return (
        <View style={styles.screen}>
            <TouchableOpacity style={styles.addButton} onPress={() => setVisible(true)}>
                <Image style={styles.addButtonIcon} source={images.addButton1} />
            </TouchableOpacity>

            <ImagePickerModal
                isVisible={visible}
                onClose={() => setVisible(false)}
                onImageLibraryPress={pickImage}
                onCameraPress={onCameraPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {

    },
    addButtonIcon: {
        height: 54,
        width: 54,
    },
    addButton: {
        borderRadius: 50,
        position: 'absolute',
        left: '70%',
        bottom: '150%',
    },
});