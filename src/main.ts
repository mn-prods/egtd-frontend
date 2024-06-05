import { enableProdMode } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => {

            const firestore = getFirestore()

            // if (!environment.production)
            //     connectFirestoreEmulator(firestore, 'localhost', 8080);

            return (firestore);

        }),
        provideAuth(() => getAuth()),
        provideRouter(routes, withHashLocation(), withViewTransitions()), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),

    ],
});
