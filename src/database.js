import firebase from "firebase/app";
import "firebase/database";

const config = {
    //API KEYS
    apiKey: "AIzaSyD1W5heoVnQOUg6ou0wXkJ9RM49c7CLr2s",
    authDomain: "vue-chat-e6d34.firebaseapp.com",
    databaseURL: "https://vue-chat-e6d34-default-rtdb.firebaseio.com",
    projectId: "vue-chat-e6d34",
    storageBucket: "vue-chat-e6d34.appspot.com",
    messagingSenderId: "144631194556",
    appId: "1:144631194556:web:31c1c7546f263bc9eb01b9"
}

const database = firebase.initializeApp(config);
export default database;