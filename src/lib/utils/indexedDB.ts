import { IDBPDatabase, openDB } from 'idb'

let DATABASE = 'test2'
let DB: any

export const createObjectStore = async (tableNames: string[]) => {
  try {
    console.log('try')
    DB = await openDB(DATABASE, 1, {
      upgrade(db: IDBPDatabase) {
        for (const tableName of tableNames) {
          if (db.objectStoreNames.contains(tableName)) {
            continue;
          }
          db.createObjectStore(tableName, { autoIncrement: true, keyPath: 'id' });
        }
      },
    });
    console.log('db created =>', DB)
  } catch (error) {
    console.log('catch', error)
    return false;
  }
}

export const getValue = async (tableName: string, id: number) => {
  const tx = DB.transaction(tableName, 'readonly');
  const store = tx.objectStore(tableName);
  const result = await store.get(id);
  console.log('Get Data ', JSON.stringify(result));
  return result;
}

export const getAllValue = async (tableName: string) => {
  const tx = DB.transaction(tableName, 'readonly');
  const store = tx.objectStore(tableName);
  const result = await store.getAll();
  //console.log('Get All Data', JSON.stringify(result));
  return result;
}

export const putValue = async (tableName: string, value: object) => {
  const tx = DB.transaction(tableName, 'readwrite');
  const store = tx.objectStore(tableName);
  const result = await store.put(value);
  console.log('Put Data ', JSON.stringify(result));
  return result;
}

export const putBulkValue = async (tableName: string, values: object[]) => {
  const tx = DB.transaction(tableName, 'readwrite');
  const store = tx.objectStore(tableName);
  for (const value of values) {
    const result = await store.put(value);
    //console.log('Put Bulk Data ', JSON.stringify(result));
  }
  return getAllValue(tableName);
}

export const deleteValue = async (tableName: string, id: number) => {
  const tx = DB.transaction(tableName, 'readwrite');
  const store = tx.objectStore(tableName);
  const result = await store.get(id);
  if (!result) {
    console.log('Id not found', id);
    return result;
  }
  await store.delete(id);
  console.log('Deleted Data', id);
  return id;
}
