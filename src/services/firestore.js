import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, setDoc, Timestamp, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

async function addDocument(collectionName, data) {
  const ref = collection(db, collectionName)
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() })
  return docRef.id
}

async function getDocuments(collectionName, orderField, direction = 'desc') {
  const ref = collection(db, collectionName)
  let q
  if (orderField) {
    q = query(ref, orderBy(orderField, direction))
  } else {
    q = query(ref)
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

async function getDocument(collectionName, docId) {
  const ref = doc(db, collectionName, docId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

async function setDocument(collectionName, docId, data) {
  const ref = doc(db, collectionName, docId)
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

async function updateDocument(collectionName, docId, data) {
  const ref = doc(db, collectionName, docId)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

async function deleteDocument(collectionName, docId) {
  const ref = doc(db, collectionName, docId)
  await deleteDoc(ref)
}

export const Firestore = {
  add: addDocument,
  list: getDocuments,
  get: getDocument,
  set: setDocument,
  update: updateDocument,
  del: deleteDocument,
}
