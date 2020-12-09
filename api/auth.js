import { db, firebaseAuth, firebaseStorage, firebase } from '@utils/firebase';
import { ALL_TEXT } from '@constants/firebase';

const usersCollection = db.collection('users');

class AuthAPI {
  registerUserWithGoogle = async () => {
    await this._googleAuth();
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;

    const [userDoc] = await Promise.all([this._createUser(userProfile)]);

    return [token, userProfile, userDoc];
  }

  logout = async () => {
    await firebaseAuth.signOut();
  }

  _googleAuth = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return await firebaseAuth.signInWithPopup(provider);
  }

  _createUser = async (userInfo) => {
    let name = userInfo.displayName;
    let profileImageUrl = userInfo.photoURL;
    if (userInfo.displayName == null) {
      // No display name, take name from email
      const email = userInfo.email;
      name = email.substring(0, email.lastIndexOf('@'));
    }
    if (userInfo.photoURL == null) {
      profileImageUrl = '';
    }

    let profileImageUrlMapping = { raw: profileImageUrl };
    for (const sizeText of ALL_TEXT) {
      profileImageUrlMapping[sizeText] = '';
    }

    const newUser = usersCollection.doc(userInfo.uid);
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      id: userInfo.uid,
      name: name,
      profileImageUrl: profileImageUrlMapping,
      hasAcceptedTermsOfService: true,
      isBlocked: false,
      joinedAt: timeNow,
      lastLoggedInAt: timeNow,
      email: userInfo.email,
      description: '',
      isEmailVerified: true,
      username: '',
    };
    await newUser.set(data);

    return newUser.get();
  }
}

export default AuthAPI;
