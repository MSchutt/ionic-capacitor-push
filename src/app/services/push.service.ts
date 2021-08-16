import { Injectable } from '@angular/core';
import {ActionPerformed, PushNotifications, Token} from '@capacitor/push-notifications';
import {FCM} from '@capacitor-community/fcm';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  greeting: Subject<string> = new Subject<string>();
  token: Subject<string> = new Subject<string>();

  registerActionPerformedHandler() {
    // Fired when push notification is clicked
    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
      const data = await notification.notification?.data;
      console.log('Received push data', JSON.stringify(data));
      // Can be sent from backend and is then displayed in the app
      if (data.greeting) {
        this.greeting.next(data.greeting);
      }
    });
  }

  // Just mock for now
  sendToBackend(token: string) {
    this.token.next(token);
  }


  async registerPush() {
    // Could also request permission here (to show for example custom UI which might increase conversion rate)
    // If you are fine with the default permission popup then manually requesting/checking permission is not necessary
    // const permission = await PushNotifications.requestPermissions();
    // permission.receive === 'denied' -> User denied (show some sad error page)

    await PushNotifications.register();
    // Will be fired when registration is successful
    PushNotifications.addListener('registration', async (token: Token) => {
      // FCM.getToken() exchanges the Apple APNS token for a firebase token; works for android as well
      const firebaseToken = await FCM.getToken();
      console.log('Firebase token received -> ', firebaseToken?.token);
      this.sendToBackend(firebaseToken?.token);
    });

    PushNotifications.addListener('pushNotificationReceived', async (notification) => {
      console.log('Received notification', JSON.stringify(notification));
      const { data } = notification;
      if (data.greeting) {
        this.greeting.next(`Notification while app open -> Greeting: ${data.greeting}`);
      }
    });


    // Will be fired if there is an registration error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

  }
}
