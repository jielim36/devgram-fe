import { initializeApp } from "firebase/app";
import { getToken, getMessaging, isSupported } from "firebase/messaging";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;
const MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;


console.log("API_KEY", API_KEY);
console.log("AUTH_DOMAIN", AUTH_DOMAIN);
console.log("PROJECT_ID", PROJECT_ID);
console.log("STORAGE_BUCKET", STORAGE_BUCKET);
console.log("MESSAGING_SENDER_ID", MESSAGING_SENDER_ID);
console.log("APP_ID", APP_ID);
console.log("MEASUREMENT_ID", MEASUREMENT_ID);
console.log("VAPID_KEY", VAPID_KEY);

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);

export const messaging = getMessaging(firebaseApp);

// getOrRegisterServiceWorker function is used to try and get the service worker if it exists, otherwise it will register a new one.
export const getOrRegisterServiceWorker = () => {
    if (
        "serviceWorker" in navigator &&
        typeof self.navigator.serviceWorker !== "undefined"
    ) {
        return self.navigator.serviceWorker
            .getRegistration("/firebase-push-notification-scope")
            .then((serviceWorker) => {
                if (serviceWorker) return serviceWorker;
                return window.navigator.serviceWorker.register(
                    "/firebase-messaging-sw.js",
                    {
                        scope: "/firebase-push-notification-scope",
                    }
                );
            });
    }
    throw new Error("The browser doesn`t support service worker.");
};

// getFirebaseToken function generates the FCM token 
export const getFirebaseToken = async () => {
    try {
        const messagingResolve = await messaging;
        if (messagingResolve) {
            return getOrRegisterServiceWorker().then((serviceWorkerRegistration) => {
                return Promise.resolve(
                    getToken(messagingResolve, {
                        vapidKey: process.env.REACT_APP_FB_VAPID_KEY,
                        serviceWorkerRegistration,
                    })
                );
            });
        }
    } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
    }
};

const UrlFirebaseConfig = new URLSearchParams(
    {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
    }.toString()
);

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL;
const swUrl = `${WEBSITE_URL}/firebase-messaging-sw.js?${UrlFirebaseConfig}`;