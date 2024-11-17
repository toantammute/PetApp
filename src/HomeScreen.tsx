import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

// Define RootStackParamList
type RootStackParamList = {
    Notification: undefined;
};
import { StackNavigationProp } from '@react-navigation/stack';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';


const HomeScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        getFcmToken();
    }, []);

    const getFcmToken = async () => {
        const token = await messaging().getToken();
        console.log("my token: "+token);
    }

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            if (remoteMessage.notification) {
                const { title, body } = remoteMessage.notification;
                console.log("message received: "+title+" "+body);
                displayNotification(title, body);
            }
        //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
    
        return unsubscribe;
    }, []);

    const displayNotification = async(title: string | undefined, body: string | undefined) =>{
        await notifee.requestPermission();

        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            vibration: true,
            importance: AndroidImportance.HIGH,
            vibrationPattern: [300, 500],
        });

        await notifee.displayNotification({
            title: title,
            body: body,
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                pressAction:{
                    id: 'default'
                }
            },
        });
    }

    return (
        <View>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Notification')
            }}>
                <Text>HomeScreen</Text>
            </TouchableOpacity>

        </View>
    )
}
export default HomeScreen


