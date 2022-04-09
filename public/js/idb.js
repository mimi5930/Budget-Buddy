// variable that holds db information
let db;

// establishes connection. Name, version
const request = indexedDB.open('budget-buddy', 1);

// if version is updated
request.onupgradeneeded = e => {
  // save database reference
  const db = e.target.result;

  // creates an object to store table
  db.createObjectStore('transaction', { autoIncrement: true });
};

// if successful
request.onsuccess = e => {
  // save reference to global db
  db = e.target.result;

  // check if app's online
  if (navigator.onLine) {
  }
};

// if there's an error
request.onerror = e => {
  console.log(e.target.errorCode);
};
