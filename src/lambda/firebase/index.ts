import * as admin from 'firebase-admin';

const serviceAccount: any = process.env.dev
  ? require('../../../plico-dev.json')
  : {};

const databaseURL = 'https://plico-dev.firebaseio.com';
const storageBucket = 'plico-dev.appspot.com';

export function initFirebase() {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
    storageBucket
  });
}
