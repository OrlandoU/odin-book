import { Middleware, NextFunction, Request, Response } from "express";
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {  getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyDRcloJ0reh5ka3ZYgFadsq4aTUKr17qt0",
    authDomain: "odinbook-ac377.firebaseapp.com",
    projectId: "odinbook-ac377",
    storageBucket: "odinbook-ac377.appspot.com",
    messagingSenderId: "499009566623",
    appId: "1:499009566623:web:2715359bacf71894566faa"
};

export const populateFirebase: Middleware = (req: Request, res: Response, next: NextFunction) => {
    req.storage = getStorage()
    next();
}

export const appFirebase: FirebaseApp = initializeApp(firebaseConfig);

