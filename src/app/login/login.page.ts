/**
* Ionic 4 Receive SMS
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
declare var SMSReceive: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {
  OTP: string = '';
  showOTPInput: boolean = false;
  OTPmessage: string = 'An OTP is sent to your number. You should receive it in 15 s'
  constructor(private toastCtrl: ToastController) {

  }

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastCtrl.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
  }

  next() {
    this.showOTPInput = true;
    this.start();
  }

  start() {
    SMSReceive.startWatch(
      () => {
        console.log('watch started');
        document.addEventListener('onSMSArrive', (e: any) => {
          console.log('onSMSArrive()');
          var IncomingSMS = e.data;
          console.log('sms.address:' + IncomingSMS.address);
          console.log('sms.body:' + IncomingSMS.body);
          /* Debug received SMS content (JSON) */
          console.log(JSON.stringify(IncomingSMS));
          this.processSMS(IncomingSMS);
        });
      },
      () => { console.log('watch start failed') }
    )
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  processSMS(data) {
    // Check SMS for a specific string sequence to identify it is you SMS
    // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
    // In this case, I am keeping the first 6 letters as OTP
    const message = data.body;
    if (message && message.indexOf('enappd_starters') != -1) {
      this.OTP = data.body.slice(0, 6);
      console.log(this.OTP);
      this.OTPmessage = 'OTP received. Proceed to register'
      this.stop();
    }
  }

  register() {
    if (this.OTP != '') {
      this.presentToast('You are successfully registered', false, 'top', 1500);
    }
    else {
      this.presentToast('Your OTP is not valid', false, 'bottom', 1500);
    }
  }


}

