import { mapSeries } from "async"
import { IDBPDatabase, openDB } from "idb"
import { stream } from "openpgp"
import { IAlbum } from "../../components/albums/AlbumCard"
import { IApiPhotoWithPreview } from "../../lib/types/photos"
import { getHeaders, getHeadersPhotos } from "../../lib/utils/auth"
import { putValue } from "../../lib/utils/indexedDB"

export const getAlbums = async (): Promise<IAlbum[]> => {
  const headers = await getHeadersPhotos('eyJhbGciOiJIUzI1NiJ9.YWxkaW1pcnByaW5jaXBhbEBnbWFpbC5jb20.CX5-pNm2ZfJRThg21HiajFPN9mvWAm2E1cDOJwO1JCE', 'poem tag digital absorb perfect vacuum sheriff salt sight jump drop mutual donkey option fuel double soon control seek edit blanket visit loan athlete')

  console.log(`${process.env.REACT_APP_PROXY_URL}/api/photos/storage/photosalbum`)
  return fetch(`${process.env.REACT_APP_API_URL}/api/photos/storage/photosalbum`, {
    method: 'GET',
    headers: headers
  }).then(res => {
    return res.json()
  }).then((res: any) => {
    console.log('res =>', res)
    return res
  })
}

export async function getPartialUploadedPhotos(matchImages: any): Promise<IApiPhotoWithPreview[]> {
  const headers = await getHeaders(true, true)

  const hashList = matchImages.assets.map((x: any) => x.hash);

  return fetch(`${process.env.REACT_APP_API_URL}/api/photos/storage/photos/partial`, {
    method: 'POST',
    headers,
    body: JSON.stringify(hashList)
  }).then(res => {
    if (res.status !== 200) { throw res; }
    return res.json();
  })
}

export function getUploadedPhotos(matchImages?: any): Promise<IApiPhotoWithPreview[]> {
  if (matchImages) {

    return getPartialUploadedPhotos(matchImages);
  }

  const headers = getHeaders(true, true)
  const h = {
    'content-type': 'application/json; charset=utf-8',
    'internxt-version': '1.0.0',
    'internxt-client': 'drive-mobile',
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.YWxkaW1pcnByaW5jaXBhbEBnbWFpbC5jb20.CX5-pNm2ZfJRThg21HiajFPN9mvWAm2E1cDOJwO1JCE`,
    'internxt-mnemonic': `poem tag digital absorb perfect vacuum sheriff salt sight jump drop mutual donkey option fuel double soon control seek edit blanket visit loan athlete`,
  }

  return fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/photos`, {
    method: 'GET',
    headers: h
  }).then(res => {
    if (res.status !== 200) { throw res; }
    return res.json();
  })
}

export async function downloadPreview(preview: any, photo: IApiPhotoWithPreview, dataBase: IDBPDatabase<unknown>): Promise<any> {
  if (!preview) {
    return Promise.resolve();
  }
  const xToken = localStorage.getItem('xToken')
  const xUser = localStorage.getItem('xUser')
  const xUserJson = JSON.parse(xUser || '{}')
  const typePreview = preview.type
  const name = preview.fileId
  const headers = getHeaders(true, true)
  const h = {
    'content-type': 'application/json; charset=utf-8',
    'internxt-version': '1.0.0',
    'internxt-client': 'drive-mobile',
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.YWxkaW1pcnByaW5jaXBhbEBnbWFpbC5jb20.CX5-pNm2ZfJRThg21HiajFPN9mvWAm2E1cDOJwO1JCE`,
    'internxt-mnemonic': `poem tag digital absorb perfect vacuum sheriff salt sight jump drop mutual donkey option fuel double soon control seek edit blanket visit loan athlete`,
  }
  //console.log('headersss:', h)

  return fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/previews/${name}`, {
    method: 'GET',
    headers: h
  }).then(res => res.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(url => {
      const photo = {
        src: url,
        type: 'image/jpeg'
      }
      console.log('url =>', url)
      return putValue('photos', photo, dataBase)
    }).catch(err => {
      console.log('err =>', err)
      throw err;
    })
}

export function getPreviews(database: IDBPDatabase<unknown>, matchImages?: any): Promise<any> {
  return getUploadedPhotos(matchImages).then((res) => {
    return mapSeries(res, (photo, next) => {
      return downloadPreview(photo.preview, photo, database).then(() => {
        next(null, photo)
      }).catch(err => {
        console.log('error downloading preview =>', err)
      })
    })
  })
}