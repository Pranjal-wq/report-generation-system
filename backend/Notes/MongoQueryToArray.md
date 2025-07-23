# MongoDB Query to Array Note

When querying MongoDB, the `find()` and `findOne()` methods behave differently:

- **`find()`**  
  - Returns a cursor to the matching documents.  
  - To get an array of documents, you must call `.toArray()`.

    ```js
    const cursor = await collection.find({ status: 'active' });
    const docs = await cursor.toArray(); // Array of documents
    ```

- **`findOne()`**  
  - Returns a single document (or `null` if no match) directly.  
  - Does *not* return a cursor, so `.toArray()` is *not* applicable.
  
    ```js

    const doc = await collection.findOne({ _id: id });
    // doc is the matching document or null
    ```
  
  - Internally, `findOne()` is equivalent to running `find()` with a `.limit(1)` and then returning the first result. For example:

    ```js

    const docs = await collection.find({ _id: id }).limit(1).toArray();
    const doc = docs[0] || null;
    ```
  
Use `.toArray()` only when working with the cursor returned by `find()`. For `findOne()`, you already get the document.
