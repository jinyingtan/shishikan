import nookies from 'nookies';
import admin from '@utils/admin-firebase';

export const verifyToken = (ctx) => {
  const cookies = nookies.get(ctx);
  const token = await admin.auth().verifyIdToken(cookies.token);
  return token;
}

export const getUserFromToken = (token) => {
  const user = {
    displayName: token.name,
    photoURL: token.picture,
    uid: token.uid,
    email: token.email,
    isEmailVerified: token.email_verified,
  };
  return user;
}