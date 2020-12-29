import React from 'react';
import { AuthProvider } from '@components/auth';
import { verifyToken, getUserFromToken } from '@utils/auth';
import BottomNavbar from '@components/bottomNavbar';
import FoodDetailBottomNavbar from '@components/bottomNavbar/FoodDetailBottomNavbar';
import TopNavbar from '@components/topNavbar';
import api from '@api';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserialiser';
import Error from 'next/error';
import FoodDetailPage from '@components/foodDetails/pages/FoodDetailPage';

import { db, firebase, firebaseAuth } from '@utils/firebase';

export async function getServerSideProps(ctx) {
  try {
    const token = await verifyToken(ctx);
    if (!token) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    }
    const user = getUserFromToken(token);
    const foodId = ctx.params.foodId;

    const [foodDoc, listDoc] = await api.lists.getFoodAndList(foodId);

    let food = null;
    let isMine = false;
    let isPrivate = false;
    let list = null;

    if (foodDoc.exists) {
      food = foodDoc.data();
      list = listDoc.data();
      deserializeFirestoreTimestampToUnixTimestamp(food);
      deserializeFirestoreTimestampToUnixTimestamp(list);
      isPrivate = listDoc.data().visibility === 'private';

      if (user?.uid === food?.user?.id) {
        isMine = true;
      }

      if (!isMine && isPrivate) {
        food = null;
        list = null;
      }
    }

    return {
      props: {
        user: user || null,
        isMine,
        food,
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

const Food = ({ user, food, list, isMine }) => {
  return (
    <AuthProvider user={user}>
      <TopNavbar />
      {food ? (
        <FoodDetailPage food={food} list={list} isMine={isMine} />
      ) : (
        <Error statusCode="404" title="The list's creator either deleted it or stopped sharing it" />
      )}
      {isMine ? <FoodDetailBottomNavbar food={food} list={list} /> : <BottomNavbar />}
    </AuthProvider>
  );
};

export default Food;
