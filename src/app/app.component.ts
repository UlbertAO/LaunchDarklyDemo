import { Component } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { AppConfigService } from './core/services/app-config.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'launch_darkly_demo';
  username: string;
  isSubmitted: boolean;
  msg: string;

  constructor(private config: AppConfigService) {
  }
  submit() {
    this.isSubmitted = true;
    if (this.username) {
      this.launchDarkly()
    }
  }

  launchDarkly() {
    const launchDarklyconfig: any = this.config.config?.launchDarkly;
    const context = {
      key: this.username
    };
    const ldClient = LDClient.initialize(launchDarklyconfig.id, context);

    ldClient.waitForInitialization()
      .then(() => {
        let grantAccess = ldClient.variation("IsPilotUser");
        // console.log('ready: ', grantAccess);
        this.access(grantAccess)


        ldClient.on("change", (value: any) => {
          if (value["IsPilotUser"]) {
            grantAccess = value["IsPilotUser"].current;
            // console.log("change", grantAccess);
            this.access(grantAccess)
          }
        });
        // setTimeout(() => {
        //   window.location.reload()
        // }, 2000);
      })

  }
  access(grantAccess:boolean){
    if (grantAccess) {
      this.msg = "Welcome";
    } else {
      this.msg = "You are not authorised to access this page.";
    }
  }

}
