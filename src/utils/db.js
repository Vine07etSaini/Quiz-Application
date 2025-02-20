import { openDB } from 'idb';

const DB_NAME = 'quiz-platform';
const ATTEMPTS_STORE = 'attempts';
const STATE_STORE = 'quizState';


export async function initDB(){
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(ATTEMPTS_STORE, { keyPath: 'id',autoIncrement: true  });
      db.createObjectStore(STATE_STORE);
    },
  });
  return db;
}

export async function saveAttempt(attempt) {
  const db = await initDB();
  return db.add(ATTEMPTS_STORE, attempt);
}

export async function getAttempts() {
  const db = await initDB();
  return db.getAll(ATTEMPTS_STORE);
}
export async function deleteAttempts() {
  const db = await initDB();
  await db.delete(ATTEMPTS_STORE);
}
export async function saveQuizState(state) {
  const db = await initDB();
  await db.put(STATE_STORE, state, 'currentState');
}
export async function getQuizState() {
  const db = await initDB();
  return await db.get(STATE_STORE, 'currentState');
}

export async function clearQuizState() {
  const db = await initDB();
  await db.delete(STATE_STORE, 'currentState');
}