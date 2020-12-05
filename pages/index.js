import TopNavbar from '@components/topNavbar';
import nookies from 'nookies';
import admin from '@utils/admin-firebase';
import { AuthProvider } from '@components/auth';

export async function getServerSideProps(ctx) {
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);
    if (!token) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    }
    const user = {
      displayName: token.name,
      photoURL: token.picture,
      uid: token.uid,
      email: token.email,
      isEmailVerified: token.email_verified,
    };

    return {
      props: {
        user: user || null,
      },
    };
  } catch (error) {
    return { props: {} };
  }
}

export default function Home({ user }) {
  return (
    <AuthProvider user={user}>
      <TopNavbar />
    </AuthProvider>
  );
}
