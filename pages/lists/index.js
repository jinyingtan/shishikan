import React from 'react';
import { AuthProvider } from '@components/auth';
import { verifyToken, getUserFromToken } from '@utils/auth';
import BottomNavbar from '@components/bottomNavbar';
import TopNavbar from '@components/topNavbar';
import ListsPage from '@components/lists/pages/ListsPage';

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
    console.log('error', error);
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return { props: {} };
  }
}

const Lists = ({ user }) => {
  return (
    <AuthProvider user={user}>
      <TopNavbar />
      <ListsPage />
      <BottomNavbar />
    </AuthProvider>
  );
};

export default Lists;
