import { db, firebaseAuth, firebase } from '@utils/firebase';
import { ALL_TEXT } from '@constants/firebase';

const usersCollection = db.collection('users');

class AuthAPI {
  authenticateUserWithGoogle = async () => {
    const user = await this._googleAuth();
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const isNewUser = user.additionalUserInfo.isNewUser;

    let userDoc;
    if (isNewUser) {
      userDoc = await this._createUser(userProfile);
    } else {
      userDoc = await usersCollection.doc(userProfile.uid).get();
    }

    return [token, userProfile, userDoc];
  };

  logout = async () => {
    await firebaseAuth.signOut();
  };

  _googleAuth = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return await firebaseAuth.signInWithPopup(provider);
  };

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
    const username = await this._generateUniqueUserName(name);

    let profileImageUrlMapping = { raw: profileImageUrl };
    for (const sizeText of ALL_TEXT) {
      profileImageUrlMapping[sizeText] = '';
    }

    const newUser = usersCollection.doc(userInfo.uid);
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      id: userInfo.uid,
      profileImageUrl: profileImageUrlMapping,
      hasAcceptedTermsOfService: true,
      isBlocked: false,
      joinedAt: timeNow,
      lastLoggedInAt: timeNow,
      email: userInfo.email,
      description: '',
      isEmailVerified: true,
      username: username,
    };
    await newUser.set(data);

    return newUser.get();
  };

  _generateUniqueUserName = async (name) => {
    let uniqueUsername = name;
    while (1) {
      const userSnapshot = await usersCollection.where('username', '==', uniqueUsername).get();
      if (userSnapshot.empty) {
        break;
      }

      uniqueUsername += '_' + Math.random().toString(36).substr(2, 9);
    }

    return uniqueUsername;
  };
}

export default AuthAPI;
