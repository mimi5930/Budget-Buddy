// variable that holds db information
let db;

// establishes connection. Name, version
const request = indexedDB.open('budget-buddy', 1);

// if version is updated
request.onupgradeneeded = e => {
  // save database reference
  const db = e.target.result;

  // creates an object to store table
  db.createObjectStore('new_transaction', { autoIncrement: true });
};

// if successful
request.onsuccess = e => {
  // save reference to global db
  db = e.target.result;

  // check if app's online
  if (navigator.onLine) {
    uploadTransaction();
  }
};

// if there's an error
request.onerror = e => {
  console.log(e.target.errorCode);
};

// if attempt to submit without connection
const saveRecord = record => {
  // open transaction
  const transaction = db.transaction(['new_transaction'], 'readwrite');

  // access transaction's objectStore
  const transactionObjectStore = transaction.objectStore('new_transaction');

  // add record
  transactionObjectStore.add(record);
};

const uploadTransaction = () => {
  // open transaction
  const transaction = db.transaction(['new_transaction'], 'readwrite');

  // access transaction's objectStore
  const transactionObjectStore = transaction.objectStore('new_transaction');

  // get records from store and set to a variable. Async!
  const getAll = transactionObjectStore.getAll();

  // if successful
  getAll.onsuccess = () => {
    // if there's data, send to api server
    if (getAll.result.length > 0) {
      // POST
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          // clear the store
          const transaction = db.transaction(['new_transaction'], 'readwrite');
          const transactionObjectStore =
            transaction.objectStore('new_transaction');
          transactionObjectStore.clear();

          alert('All deposits and withdrawals have been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
};

// when app comes back online

window.addEventListener('online', uploadTransaction);
