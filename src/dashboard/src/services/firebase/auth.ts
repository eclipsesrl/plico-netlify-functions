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

  register(credentials: { email: string; password: string }) {
    return this.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }
  async logout() {
    await this.auth.signOut();
  }
}
