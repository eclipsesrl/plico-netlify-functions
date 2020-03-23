import * as admin from 'firebase-admin';
import { User } from './user.model';
import { UserData, defaultUserData } from './userdata.model';
import { UnauthorizedException } from '../../utils/exceptions';
import { UserPlan } from './plan.enum';

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

  async addStripeCustomerId(customerId: string, uid: string) {
    const userdataReference = this.database.doc(`users/${uid}`);
    await userdataReference.update({
      stripeCustomerId: customerId
    })
  }

  async updateCustomerPlan(customerId: string, plan: UserPlan) {
   const res = await this.database.collection('users').where('stripeCustomerId', '==', customerId).get();
   if (res.empty) {
     console.error(`User with ${customerId} not found`);
     return;
   }
   const userDoc = res.docs[0];
   await this.database.doc(`users/${userDoc.id}`).update({
     plan
   })
  }
}
