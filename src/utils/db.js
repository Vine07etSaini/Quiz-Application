import { openDB } from 'idb';
const DB_NAME = 'quiz-platform';
const ATTEMPTS_STORE = 'attempts';

export async function initDB(){
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(ATTEMPTS_STORE, { keyPath: 'id',autoIncrement: true  });
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


