// src/firestore.js
// -------------------------------------------------------------
// Helper functions for interacting with Firestore.
// The project stores user-specific "favorites" documents under
// the path `/users/{uid}/favorites/{itemId}`.
// -------------------------------------------------------------

import { db } from './firebaseConfig.js';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
} from 'firebase/firestore';

// saveFavorite(userId, item)
// ---------------------------
// Stores a favorite hike (or other object) for the given user. The
// `item` argument should be an object with an `id` field that uniquely
// identifies it (e.g. hike id), plus any extra data you want to keep.
//
// Example:
//   await saveFavorite(user.uid, { id: 'trail42', name: 'Sunset Peak' });
//
export async function saveFavorite(userId, item) {
  if (!userId || !item?.id) {
    throw new Error('saveFavorite requires userId and item.id');
  }
  const ref = doc(db, 'users', userId, 'favorites', item.id);
  await setDoc(ref, item);
}

// removeFavorite(userId, itemId)
// -------------------------------
// Deletes a favorite entry for the user.
export async function removeFavorite(userId, itemId) {
  if (!userId || !itemId) {
    throw new Error('removeFavorite requires userId and itemId');
  }
  const ref = doc(db, 'users', userId, 'favorites', itemId);
  await deleteDoc(ref);
}

// getFavorites(userId)
// ---------------------
// Returns an array of favorite items for the user. Each element will be
// { id: ..., ...fields }. Returns [] if the user has none or if the
// userId is falsy.
export async function getFavorites(userId) {
  if (!userId) {
    return [];
  }
  const q = query(collection(db, 'users', userId, 'favorites'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
