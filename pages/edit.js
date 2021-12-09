import React from 'react';
import AddPage from '@components/add/pages/AddPage';
import { AuthProvider } from '@components/auth';
import { verifyToken, getUserFromToken } from '@utils/auth';
import BottomNavbar from '@components/bottomNavbar';
import TopNavbar from '@components/topNavbar';
import api from '@api';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserialiser';

export async function getServerSideProps(ctx) {
  try {
    const token = await verifyToken(ctx);
    if (!token) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    }
    const user = getUserFromToken(token);

    const listId = ctx.query.listId;
    const foodId = ctx.query.foodId;
    const foodDoc = await api.lists.getFood(listId, foodId);
    let food = null;
    if (foodDoc.exists) {
      food = foodDoc.data();
      deserializeFirestoreTimestampToUnixTimestamp(food);
    }
    return {
      props: {
        user: user || null,
        listId: listId || null,
        foodId: foodId || null,
        food: food || null,
      },
    };
  } catch (error) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return { props: {} };
  }
}

const Edit = ({ user, listId, foodId, food }) => {
  return (
    <AuthProvider user={user}>
      <TopNavbar />
      <AddPage listId={listId} foodId={foodId} food={food} />
      <BottomNavbar />
    </AuthProvider>
  );
};

export default Edit;
