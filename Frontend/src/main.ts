// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { App } from './app/app';

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));


// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';

import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app';

import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {

  providers: [

    provideRouter(routes),

    provideHttpClient()

  ]

})
.catch((err) => console.error(err));