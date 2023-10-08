import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfigService } from './app/core/services/app-config.service';

function bootstrapApp(): void {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", () => {
  // we bootstrapping app from browser, we need to fetch config.json
  fetch(AppConfigService.configPath)
    .then((res) => {
      return res.json();
    })
    .then((jsonData) => {
      sessionStorage[AppConfigService.configPath] = JSON.stringify(jsonData);
      bootstrapApp();
    })
    .catch((error) => {
      console.warn("caught when bootstrapping app");
      console.error(error);
    })
})

