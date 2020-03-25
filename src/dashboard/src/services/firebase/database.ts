import 'firebase/firestore';
import firebase from 'firebase';

export default class DatabaseService {
  private database: firebase.firestore.Firestore;

  constructor() {
    this.database = firebase.firestore();
  }
}
