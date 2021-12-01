import * as React from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";
import {useState, useEffect} from "react";


const AllEventsMap = ({navigation,route}) => {

    //Her instantieres alle anvendte statevariabler
    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [selectedCoordinate, setSelectedCoordinate] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState(null)

    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item)=>{
            setlocationPermission(item.granted)
        } );

    };

    useEffect (() => {
        const response = getLocationPermission()
    });

    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item)=>{
            setCurrentLocation(item.coords)
        } );
    };

    const handleLongPress = event => {
       // const coordinate = event.nativeEvent.coordinate
       // setUserMarkerCoordinates((oldArray) => [...oldArray, coordinate])
    };

    const handleSelectMarker = async coordinate =>{
        setSelectedCoordinate(coordinate)
        await Location.reverseGeocodeAsync(coordinate).then((data) => {
                setSelectedAddress(data)
            }
        )
    };

    const closeInfoBox = () =>
        setSelectedCoordinate(null) && setSelectedAddress(null)

    const RenderCurrentLocation = (props) => {
        if (props.hasLocationPermission === null) {
            return null;
        }
        if (props.hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }
        return (
            <View>

                {currentLocation && (
                    <Text>
                        {`lat: ${currentLocation.latitude},\nLong:${
                            currentLocation.longitude
                        }\nacc: ${currentLocation.accuracy}`}
                    </Text>
                )}
            </View>
        );
    };
//<Button style title="update location" onPress={updateLocation} />
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
                    <Marker
                        coordinate={{ latitude: 55.676195, longitude: 12.569419 }}
                        title="Rådhuspladsen"
                        description="Flee market"
                    />
                    <Marker
                        coordinate={{ latitude: 55.673035, longitude: 12.568756 }}
                        title="Tivoli"
                        description="Christmas market"
                    />
                    <Marker
                        coordinate={{ latitude: 55.674082, longitude: 12.598108 }}
                        title="Christiania"
                        description="Another Market"

                    />

                    <Marker
                        coordinate={{ latitude: 55.676882, longitude: 12.592108 }}
                        title="A Place"
                        description="Yet another Market"

                    />
                    <Marker
                        coordinate={{ latitude: 55.686882, longitude: 12.602108 }}
                        title="A Place in the water"
                        description="Fishing?"

                    />

                </MapView>
                {selectedCoordinate && selectedAddress && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Address: {selectedAddress[0].street} {selectedAddress[0].name} {selectedAddress[0].postalCode} {selectedAddress[0].city}
                        </Text>
                        <Button title="Close" onPress={CloseBox} />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
/*
* {userMarkerCoordinates.map((coordinate, index) => (
                        <Marker
                            coordinate={coordinate}
                            key={index.toString()}
                            onPress={() => handleSelectMarker(coordinate)}
                        />
                    ))}
* */

//Lokal styling til brug i App.js
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    map: { flex: 1 },
    infoBox: {
        height: 200,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 15,
    },
});
export default AllEventsMap