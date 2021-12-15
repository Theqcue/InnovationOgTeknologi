import * as React from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";
import {useState, useEffect, useImperativeHandle, forwardRef} from "react";
    //const Map = (navigation, parentCallback, userMarkerCoordinatesParent, parentRemoveCallback, ref ) => {
const Map = (prop, ref) => {
    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState(prop.userMarkerCoordinatesParent)
    const [selectedCoordinate, setSelectedCoordinate] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState(null)

    useImperativeHandle(ref, () => ({
        // methods connected to `ref`
        reset: () => { reset() }
    }))

    const reset = () => {
        setUserMarkerCoordinates([]);
        setSelectedCoordinate(null);
        setSelectedAddress(null);
    }


    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item)=>{
            setlocationPermission(item.granted)
        } );

    };

    useEffect (() => {
        const response = getLocationPermission()
    });

    //Adds new marker when long press
    const handleLongPress = event => {
        if(!prop.isEditEvent) {

            const coordinate = event.nativeEvent.coordinate;
            setUserMarkerCoordinates((oldArray) => [...oldArray, coordinate]);
            prop.parentCallback(coordinate);
        }
    };

    //Find the address of the selected marker
    const handleSelectMarker = async coordinate =>{
            setSelectedCoordinate(coordinate)
            await Location.reverseGeocodeAsync(coordinate).then((data) => {
                    setSelectedAddress(data)
                }
            )
    };
    function removeItemOnce(arr, value) {
        const index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
    //Delete the Marker
    const DeleteBox = () => {
        removeItemOnce(userMarkerCoordinates, selectedCoordinate);
        prop.parentRemoveCallback(selectedCoordinate);
        setSelectedCoordinate(null) && setSelectedAddress(null);

    }
    //Close pop up box
    const CloseBox = () => {
        setSelectedCoordinate(null) && setSelectedAddress(null);
    }
    //Getting users currect location
    const RenderCurrentLocation = (props) => {
        if (props.hasLocationPermission === null) {
            return null;
        }
        if (props.hasLocationPermission === false) {
            return <Text>Ikke nogen lokationsadgang. Gå til indstillinger for at ændre. </Text>;
        }
        return (
            <Text></Text>
        );
    };
    {
        return (
            <SafeAreaView style={styles.container}>
                <RenderCurrentLocation props={{hasLocationPermission: hasLocationPermission, currentLocation: currentLocation}} />
                <MapView
                    provider="google"
                    style={styles.map}
                    showsUserLocation
                    onLongPress={handleLongPress}
                    initialRegion={{
                        latitude: 55.676098,
                        longitude: 12.568337,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.05,
                    }}>

                    {prop.userMarkerCoordinatesParent.map((coordinate, index) => (
                        <Marker
                            coordinate={coordinate}
                            key={index.toString()}
                            onPress={() => handleSelectMarker(coordinate)}
                        />
                    ))}
                </MapView>
                {selectedCoordinate && selectedAddress && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Address: {selectedAddress[0].street} {selectedAddress[0].name} {selectedAddress[0].postalCode} {selectedAddress[0].city}
                        </Text>
                        {(prop.isEditEvent === true) ? <Text> </Text> : <Button title="Delete Marker" onPress={DeleteBox}/>}
                        <Text></Text>
                        <Button title="Close" onPress={CloseBox} />
                    </View>
                )}

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        //paddingTop: Constants.statusBarHeight,
        backgroundColor: '#f0f0f5',
        //padding: 8,
        position: 'relative',
    },
    map: { flex: 1 },
    infoBox: {
        height: 200,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#4db5ac',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 15,
    },
});
export default forwardRef(Map)