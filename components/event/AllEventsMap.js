import * as React from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {useState, useEffect} from "react";
import firebase from "firebase";
import {useIsFocused} from "@react-navigation/native";


const AllEventsMap = ({navigation,route}) => {
    //Setting the state
    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [Events, setEvents] = useState([])
    const [ids, setIds] = useState([])

    const isFocused = useIsFocused();

    //Get location permissions
    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item) => {
            setlocationPermission(item.granted)
        });

    };

    useEffect(() => {
        const response = getLocationPermission()
    });
    //Getting all the Map-markers that are in the database
    useEffect(() => {
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
                snapshot.forEach((data, index) => {

                    x.push([data.key, data.val()]);
                    i = i + 1;
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

    //Dont do anything if the user tries to create a marker
    const handleLongPress = event => {
    };

    //Navigate to event details on press
    const handleSelectMarker =  id => {
        const Event = Object.entries(Events).find( Event => Event[0] === id /*id*/)
        navigation.navigate('Event Details', { Event});

    };
    //Finds the location of the user
    const RenderCurrentLocation = (props) => {
        if (props.hasLocationPermission === null) {
            return null;
        }
        if (props.hasLocationPermission === false) {
            return <Text> Ikke nogen lokationsadgang. Gå til indstillinger for at ændre.</Text>;
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
    const userMarkerCoordinatesArray = Object.values(userMarkerCoordinates);

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
                                key={index}
                                onPress={() => handleSelectMarker(ids[index])}
                            />
                        )) : <Marker
                        coordinate={{latitude: 55.676195, longitude: 12.569419}}
                        title="Rådhuset"
                        description="Flee market"
                    />}
            </MapView>
        </SafeAreaView>
    )

}
export default AllEventsMap;

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
