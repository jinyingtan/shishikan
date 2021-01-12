import TopNavbar from '@components/topNavbar';
import { AuthProvider } from '@components/auth';
import { verifyToken, getUserFromToken } from '@utils/auth';
import BottomNavbar from '@components/bottomNavbar';
import HomePage from '@components/home/pages/HomePage';

export async function getServerSideProps(ctx) {
  try {
    const token = await verifyToken(ctx);
    if (!token) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    }
    const user = getUserFromToken(token);
    const around = ctx.query?.around;
    return {
      props: {
        user: user || null,
        around: around || null,
      },
    };
  } catch (error) {
    return { props: {} };
  }
}

export default function Home({ user, around }) {
  return (
    <AuthProvider user={user}>
      <TopNavbar />
      <HomePage around={around} />
      <BottomNavbar />
    </AuthProvider>
  );
}
