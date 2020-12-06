import TopNavbar from '@components/topNavbar';
import { AuthProvider } from '@components/auth';
import { verifyToken, getUserFromToken } from '@utils/auth';

export async function getServerSideProps(ctx) {
  try {
    const token = await verifyToken(ctx);
    if (!token) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    }
    const user = getUserFromToken(token);

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
