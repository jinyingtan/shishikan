import React, { useEffect } from 'react';
import AddPage from '@components/add/pages/AddPage';
import { AuthProvider } from '@components/auth';
import { verifyToken, getUserFromToken } from '@utils/auth';
import BottomNavbar from '@components/bottomNavbar';
import TopNavbar from '@components/topNavbar';

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
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return { props: {} };
  }
}

const Add = ({ user }) => {
  return (
    <AuthProvider user={user}>
      <TopNavbar />
      <AddPage />

      <BottomNavbar />
    </AuthProvider>
  );
};

export default Add;
