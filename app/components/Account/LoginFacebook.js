import React, {useState} from 'react';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import {useNavigation} from '@react-navigation/native';

import {FacebookApi} from '../../utils/social';
import Loading from '../Loading'

export default function LoginFacebook(props) {
    const {toastRef} = props

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false)

    /* Es necesario que sea asíncrona por la documentación de Facebook */
    const login = async () => {
        await Facebook.initializeAsync(FacebookApi.application_id);

        const {type, token} = await Facebook.logInWithReadPermissionsAsync({
            permissions: FacebookApi.permissions
        })

        if(type === "success") {
            setLoading(true)
            const credentials = firebase.auth().FacebookAuthProvider.credential(token);
            firebase.auth().signInWithCredential(credentials).then(() => {
                setLoading(false)
                navigation.navigate("account")
            }).catch(() => {
                setLoading(false)
                toastRef.current.show("Credenciales incorrectas")
            })
        } else if(type === "cancel") {
            toastRef.current.show("Inicio de sesión cancelado")
        } else {
            toastRef.current.show("Error desconocido. Inténtelo más tarde")
        }
    }

    return (
        <>
            <SocialIcon 
                title="Iniciar sesión con Facebook"
                button
                type="facebook"
                onPress={login}
            />
            <Loading isVisible={loading} text="Iniciando sesión"/>
        </>
    )
}