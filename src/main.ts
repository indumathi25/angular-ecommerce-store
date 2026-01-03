import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Check if service worker is supported by our browser
if (navigator.serviceWorker) {
  // Register the service worker
  navigator.serviceWorker
    .register('./sw.js')
    .then((registration) => {
      console.log('Service worker registered successfully', registration);
    })
    .catch((err) => {
      console.log('Error registering service worker', err);
    });
}
