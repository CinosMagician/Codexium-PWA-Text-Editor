import { openDB } from 'idb';

// Initialize the database
const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Method to add content to the database
export const putDb = async (content) => {
  console.log('PUT to the database');

  // Open the database
  const db = await openDB('jate', 1);

  // Start a new transaction and get the object store
  const tx = db.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');

  // Add the content to the store with a fixed id to update the same entry
  const request = store.put({ id: 1, content });

  // Get confirmation of the request
  const result = await request;
  console.log('data saved to the database', result);
};

// Method to get the latest content from the database
export const getDb = async () => {
  console.log('GET content from the database');

  // Open the database
  const db = await openDB('jate', 1);

  // Start a new transaction and get the object store
  const tx = db.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');

  // Get the content with the fixed id
  const request = store.get(1);

  // Get confirmation of the request
  const result = await request;
  console.log('data retrieved from the database', result);
  return result?.content;
};

// Initialize the database
initdb();