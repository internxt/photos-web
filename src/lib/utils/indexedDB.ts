import { IDBPDatabase, openDB } from 'idb'

let DATABASE = 'test2'

export const createObjectStore = async (tableNames: string[]) => {
  try {
    const dataBase = await openDB(DATABASE, 1, {
      upgrade(db: IDBPDatabase) {
        for (const tableName of tableNames) {
          if (db.objectStoreNames.contains(tableName)) {
            continue
          }
          db.createObjectStore(tableName)
        }
      },
    })
    console.log('db created =>', dataBase)
    return dataBase
  } catch (error) {
    console.log('database catch', error)
    return false
  }
}

export const getValue = async (tableName: string, id: number | string, openedDataBase: IDBPDatabase<unknown>) => {
  const tx = openedDataBase.transaction(tableName, 'readonly')
  const store = tx.objectStore(tableName)
  const result = await store.get(id)
  return result
}

export const getAllValues = async (tableName: string, openedDataBase: IDBPDatabase<unknown>) => {
  const tx = openedDataBase.transaction(tableName, 'readonly')
  const store = tx.objectStore(tableName)
  const result = await store.getAll()
  //console.log('Get All Data', JSON.stringify(result))
  return result
}

export const putValue = async (tableName: string, value: any, primaryKey: IDBKeyRange | IDBValidKey | undefined, openedDataBase: IDBPDatabase<unknown>) => {
  const tx = openedDataBase.transaction(tableName, 'readwrite')
  const store = tx.objectStore(tableName)
  const result = await store.put(value, primaryKey)
  console.log('Put Data ', JSON.stringify(result))
  return result
}

export const putBulkValue = async (tableName: string, values: object[], openedDataBase: IDBPDatabase<unknown>) => {
  const tx = openedDataBase.transaction(tableName, 'readwrite')
  const store = tx.objectStore(tableName)
  for (const value of values) {
    const result = await store.put(value)
    //console.log('Put Bulk Data ', JSON.stringify(result))
  }
  return getAllValues(tableName, openedDataBase)
}

export const deleteValue = async (tableName: string, id: number, openedDataBase: IDBPDatabase<unknown>) => {
  const tx = openedDataBase.transaction(tableName, 'readwrite')
  const store = tx.objectStore(tableName)
  const result = await store.get(id)
  if (!result) {
    console.log('Id not found', id)
    return result
  }
  await store.delete(id)
  console.log('Deleted Data', id)
  return id
}
