import { Component } from '@angular/core';
declare var SMSReceive: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  OTP: string = '';
  constructor() {

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
    }
  }


}
