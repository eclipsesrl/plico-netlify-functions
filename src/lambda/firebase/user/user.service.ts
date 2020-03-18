import * as admin from 'firebase-admin';
import { User } from './user.model';
import { UserData, defaultUserData } from './userdata.model';
import { UnauthorizedException } from '../../utils/exceptions';

export class UserService {
  private database: FirebaseFirestore.Firestore;
  private auth: admin.auth.Auth;

  constructor() {
    this.database = admin.firestore();
    this.auth = admin.auth();
  }
  async validateUser(token: string): Promise<User> {
    try {
      const { email, uid } = await this.auth.verifyIdToken(token);
      return { email, uid };
    } catch (e) {
      throw UnauthorizedException('Invalid token');
    }
  }

  async getUserdata(uid: string): Promise<UserData> {
    const userdataReference = this.database.doc(`users/${uid}`);
    const userdataSnapshot = await userdataReference.get();
    if (userdataSnapshot.exists) {
      const userdata = {
        ...defaultUserData,
        ...(userdataSnapshot.data() || {})
      };
      return userdata;
    } else {
      // Create initial data for User
      await userdataReference.set(defaultUserData);
      return defaultUserData;
    }
  }
}
