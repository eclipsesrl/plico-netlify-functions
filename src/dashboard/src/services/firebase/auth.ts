import firebase from 'firebase';
import 'firebase/auth';

export default class AuthService {
  private auth: firebase.auth.Auth;

  constructor(private dispatch: Function) {
    this.auth = firebase.auth();

    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.dispatch('changeState', user);
      } else {
        this.dispatch('changeState');
      }
    });
  }

  login(credentials: { email: string; password: string }) {
    return this.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  async register(credentials: {
    email: string;
    password: string;
    name: string;
  }) {
    await this.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    const user = this.auth.currentUser;
    await user?.updateProfile({
      displayName: credentials.name
    });
  }
  async logout() {
    await this.auth.signOut();
  }
}
