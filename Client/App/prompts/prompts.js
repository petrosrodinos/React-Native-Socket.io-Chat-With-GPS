import { AuthContext } from "../context/auth-context"
import {useContext} from 'react';
import {Alert} from 'react-native';

export const prompts = ()=>{
    const auth = useContext(AuthContext);

    const confirmLogout = ()=>{
        Alert.alert('Log out','Are you sure you want to log out',
        [{text:'Yes',onPress:()=>{auth.logout()}},{text:'No'}])
    }

    return {confirmLogout};

}