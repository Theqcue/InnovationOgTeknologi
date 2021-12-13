import React, {useState, useCallback, useEffect} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View, Text, Button} from 'react-native';
//import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerHeader} from "./ImagePickHead";
import {ImagePickerAvatar} from "./ImagePickAva";
import {ImagePickerModal} from "./ImagePicker";
import {images} from "../../assets";

export default function Picker({getFilepath}) {
    const [pickerResponse, setPickerResponse] = useState(null);
    const [visible, setVisible] = useState(false);
    const [image, setImage] = useState(null);

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
                //handleUpload(newfile)
                console.log(newfile);
                setPickerResponse(newfile.uri);
                getFilepath(newfile.uri);
            }
        }else{
            Alert.alert("you need to give up permission to work")
        }
    }

    const uri = pickerResponse;

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
//            {(pickerResponse !== null) ? <Text> {pickerResponse} </Text> : <Text> No picker </Text>  }
//<ImagePickerHeader />
//<ImagePickerAvatar uri={uri} onPress={() => setVisible(true)} />

//             <ImagePickerAvatar uri={uri} onPress={() => setVisible(true)} />
const styles = StyleSheet.create({
    screen: {

    },
    addButtonIcon: {
        height: 54,
        width: 54,
    },
    addButton: {
        //height: 54,
        //width: 54,
        //backgroundColor: '#f2f2fC',
        borderRadius: 50,
        position: 'absolute',
        left: '70%',
        bottom: '150%',
    },
});