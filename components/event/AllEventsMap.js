import * as React from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";
import {useState, useEffect} from "react";
import firebase from "firebase";
import {useIsFocused} from "@react-navigation/native";


const AllEventsMap = ({navigation,route}) => {

    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [selectedCoordinate, setSelectedCoordinate] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [Events, setEvents] = useState([])
    const [ids, setIds] = useState([])

    const isFocused = useIsFocused();

    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item) => {
            setlocationPermission(item.granted)
        });

    };

    useEffect(() => {
        console.log("ef1")
        const response = getLocationPermission()
    });

    useEffect(() => {
        console.log("ef3")
        firebase
            .database()
            .ref('/Events')
            .on('value', function (snapshot) {

                const x = [];
                const allCoords = [];
                const allids = [];
                let i = 0
                const no_of_events = Object.keys(snapshot.val()).length;
                let last_run = false;
                //console.log("snapshot");
                //console.log(Object.keys(snapshot.val()));
                snapshot.forEach((data, index) => {
                    //console.log("index");
                    //console.log(index);

                    x.push([data.key, data.val()]);
                    i = i + 1;
                    console.log(i);
                    console.log(no_of_events);
                    if (i === no_of_events) {
                        last_run = true;
                        setEvents(snapshot.val());
                    }
                    data.val().userMarkerCoordinates.forEach((coords) => {

                        allCoords.push(
                            {latitude: coords.latitude, longitude: coords.longitude}
                        );
                        allids.push(data.key);
                        if (last_run) {
                            setUserMarkerCoordinates(allCoords);
                            setIds(allids);
                        }


                    });
                });
            })


    }, []);

    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item) => {
            setCurrentLocation(item.coords)
        });
    };

    const handleLongPress = event => {
        // const coordinate = event.nativeEvent.coordinate
        // setUserMarkerCoordinates((oldArray) => [...oldArray, coordinate])
    };

    const handleSelectMarker =  id => {
        console.log(id);
        //console.log(Events[0][0]);
        const Event = Object.entries(Events).find( Event => Event[0] === id /*id*/)
        console.log(Event);
        navigation.navigate('Event Details', { Event});



        /*console.log("insideSelectMaker");
        console.log(coordinate);
        setSelectedCoordinate(coordinate)
        await Location.reverseGeocodeAsync(coordinate).then((data) => {
                console.log(data);
                setSelectedAddress(data)
             console.log(selectedAddress )
            console.log("selectedCoordinate && selectedAddress")
            }
        )
         */
    };

    const CloseBox = () => {
        setSelectedCoordinate(null) && setSelectedAddress(null);
    }

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
    //console.log("isFocused");
    //console.log(isFocused);
    const userMarkerCoordinatesArray = Object.values(userMarkerCoordinates);
    //console.log(userMarkerCoordinatesArray);
    //const eventArray = Events;
    //const eventIndex = Object.keys(Events);

    return (
        <SafeAreaView style={styles.container}>
            <RenderCurrentLocation
                props={{hasLocationPermission: hasLocationPermission, currentLocation: currentLocation}}/>
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


                {(userMarkerCoordinatesArray.length > 0) ?
                    userMarkerCoordinatesArray.map((coordinate, index) =>
                        (
                            <Marker
                                coordinate={coordinate}
                                //title={ids[index]}
                                key={index}
                                onPress={() => handleSelectMarker(ids[index])}
                            />
                        )) : <Marker
                        coordinate={{latitude: 55.676195, longitude: 12.569419}}
                        title="not Rådhuset"
                        description="Flee market"
                    />}


            </MapView>
        </SafeAreaView>
    )

}
export default AllEventsMap;

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
        //position: 'absolute',
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

/*
*                 {selectedCoordinate && selectedAddress &&
                (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Address: {selectedAddress[0].street} {selectedAddress[0].name} {selectedAddress[0].postalCode} {selectedAddress[0].city}
                        </Text>

                        <Button title="Close" onPress={CloseBox} />
                    </View>
                )
                }
*
* */