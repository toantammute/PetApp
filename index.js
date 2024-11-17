import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import NavigationService from './src/Navigation';
import messaging from '@react-native-firebase/messaging';

let notificationDisplayed = true;

const displayNotification = async (title, body) => {
    try {
        await notifee.requestPermission();
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            vibration: true,
            sound: 'default',
            importance: AndroidImportance.HIGH,
            vibrationPattern: [300,500]
        });
        if(AppState.currentState !=='active' && !notificationDisplayed){
            await notifee.displayNotification({
                title: title,
                body: body,
                android: {
                    channelId: channelId,
                    importance: AndroidImportance.HIGH,
                    pressAction:{
                        id: 'default',
                        // launchActivity: 'default'
                    }
                },
            });
            notificationDisplayed = true;
        }
        
    } catch (error) {
        console.log("Errpr displaying notification: " +error);
    }
}

const backgroundMessageHandler = async(remoteMessage)=>{
    if(remoteMessage){
        const {title, body} = remoteMessage.notification;
        await displayNotification(title, body);
        NavigationService.navigate('Notification');
    }
}

messaging().setBackgroundMessageHandler(backgroundMessageHandler);

messaging().getInitialNotification().then(async(remoteMessage)=>{
    if(remoteMessage){
        const {title, body} = remoteMessage.notification;
        await displayNotification(title, body);
        NavigationService.navigate('Notification');
    }
});

AppRegistry.registerComponent(appName, () => App);

notifee.onForegroundEvent(async ({type, detail})=>{
    switch(type){
        case EventType.DISMISSED:
            console.log("User dismissed notification", detail.notification);
            // notificationDisplayed = false;
            break;
        case EventType.PRESS:
            setTimeout(()=>{
                NavigationService.navigate('Notification');
            }, 1000);
            console.log("User pressed notification", detail.notification);
            break;
    }
});

notifee.onBackgroundEvent(async ({type, detail})=>{
    switch(type){
        case EventType.DISMISSED:
            console.log("User dismissed notification", detail.notification);
            // notificationDisplayed = false;
            break;
        case EventType.PRESS:
            setTimeout(()=>{
                NavigationService.navigate('Notification');
            }, 1000);
            console.log("User pressed notification", detail.notification);
            break;
    }
});