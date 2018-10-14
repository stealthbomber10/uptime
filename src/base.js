import firebase from 'firebase/app';
import 'firebase/auth';

const app = firebase.initializeApp({
    apiKey: "AIzaSyAaQVWqEydHxXtcwaaRyEpiVhJ-vhPJfBo",
    authDomain: "uptime-69073.firebaseapp.com",
    databaseURL: "https://uptime-69073.firebaseio.com",
    projectId: "uptime-69073",
    storageBucket: "",
    messagingSenderId: "43889297910"
});

export const auth = firebase.auth();

export const db = firebase.database(app);

export default app
