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

export async function getServerSideProps(ctx) {
  let token = null;
  let user = null;
  try {
    token = await verifyToken(ctx);
    user = getUserFromToken(token);
  } catch (error) {
    token = null;
    user = null;
  }

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
