import React, {useState} from 'react';
import {Button,Text, View, TextInput, StyleSheet} from 'react-native';
import firebase from 'firebase';

function formLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // skal nedenstående bruges?
    //const [isCompleted, setCompleted] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const renderButton = () => {
        return <Button style = {styles.btn} onPress={() => handleSubmit()} title="Login" />;
    };

    //Logging in user
    const handleSubmit = async() => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then((data)=>{
            });
        } catch (error){
            setErrorMessage(error.message)
        }
    }

    return (
        <View>
            <Text style={styles.header}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(email) => setEmail(email)}
                style={styles.inputField}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry
                style={styles.inputField}
            />
            {errorMessage && (
                <Text style={styles.error}>Error: {errorMessage}</Text>
            )}
            {renderButton()}
        </View>
    );
}

export default formLogin

const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    inputField: {
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderColor: "#4db5ac",
        width: 300,
        borderRadius: 10,
    },
    header: {
        fontSize: 34,
        color: "#ec6e35",
        textAlign: "center",
    },
    btn: {
        color: "#4db5ac",
    }

});