import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBkEhD20lyESuNqLbtLJu-SezB1Dlt6_Oo',
  authDomain: 'plico-dev.firebaseapp.com',
  databaseURL: 'https://plico-dev.firebaseio.com',
  projectId: 'plico-dev',
  storageBucket: 'plico-dev.appspot.com',
  messagingSenderId: '281740074640',
  appId: '1:281740074640:web:06b201c8c0816055894215'
};

class FirebaseService {
  constructor() {
    firebase.initializeApp(firebaseConfig);
  }

  async login() {
    await firebase
      .auth()
      .signInWithEmailAndPassword('flc.pietro@gmail.com', 'aj8m6n4t');
  }

  async getToken() {
    return await firebase.auth().currentUser?.getIdToken();
  }
}

const service = new FirebaseService();

export default service;
