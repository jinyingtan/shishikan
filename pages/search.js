import React from 'react';
import SearchPage from '@components/search/pages/SearchPage';
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

const Search = ({ user }) => {
  return (
    <AuthProvider user={user}>
      <SearchPage />
    </AuthProvider>
  );
};

export default Search;
