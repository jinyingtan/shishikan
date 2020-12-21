import React from 'react';
import { AuthProvider } from '@components/auth';
import { verifyToken, getUserFromToken } from '@utils/auth';
import BottomNavbar from '@components/bottomNavbar';
import TopNavbar from '@components/topNavbar';
import api from '@api';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserialiser';
import Error from 'next/error';
import ListPage from '@components/list/pages/ListPage';

export async function getServerSideProps(ctx) {
  try {
    const token = await verifyToken(ctx);
    if (!token) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    }
    const user = getUserFromToken(token);
    const listId = ctx.params.listId;
    const listDoc = await api.lists.getList(listId);

    let list = null;
    let isMine = false;
    let isPrivate = false;

    if (listDoc.exists) {
      list = listDoc.data();
      deserializeFirestoreTimestampToUnixTimestamp(list);
      isPrivate = list.visibility === 'private';

      if (user?.uid === list?.user?.id) {
        isMine = true;
      }

      if (!isMine && isPrivate) {
        list = null;
      }
    }

    return {
      props: {
        user: user || null,
        isMine,
        list,
      },
    };
  } catch (error) {
    console.log('error', error);
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return { props: {} };
  }
}

const List = ({ user, list, isMine }) => {
  return (
    <AuthProvider user={user}>
      <TopNavbar />
      {list ? (
        <ListPage isMine={isMine} list={list} />
      ) : (
        <Error statusCode="404" title="The list's creator either deleted it or stopped sharing it" />
      )}
      <BottomNavbar />
    </AuthProvider>
  );
};

export default List;
