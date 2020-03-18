import * as admin from 'firebase-admin';

const serviceAccount: any = {
    // TODO: Get from Env
};

const databaseURL = 'https://plico-dev.firebaseio.com';
const storageBucket = 'plico-dev.appspot.com';

export function initFirebase() {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
    storageBucket
  });
}
