import { mapSeries } from "async"
import { IDBPDatabase, openDB } from "idb"
import { stream } from "openpgp"
import { IAlbum } from "../../components/Albums/AlbumCard"
import { IApiPhotoWithPreview } from "../../lib/types/photos"
import { getHeaders, getHeadersPhotos } from "../../lib/utils/auth"
import { putValue } from "../../lib/utils/indexedDB"

export const getAlbums = async (): Promise<IAlbum[]> => {
  const headers = await getHeaders(true, true)

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
    'Authorization': `Bearer ${process.env.REACT_APP_XTOKEN}`,
    'internxt-mnemonic': process.env.REACT_APP_MNEMONIC
  }

  return fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/photos`, {
    method: 'GET',
    headers: h
  }).then(res => {
    if (res.status !== 200) { throw res; }
    return res.json();
  })
}

export async function downloadPreview(preview: any, dataBase: IDBPDatabase<unknown>): Promise<any> {
  if (!preview) {
    return Promise.resolve();
  }
  const xToken = localStorage.getItem('xToken')
  const xUser = localStorage.getItem('xUser')
  const xUserJson = JSON.parse(xUser || '{}')
  const typePreview = preview.type
  const previewId = preview.fileId
  const headers = getHeaders(true, true)
  const h = {
    'content-type': 'application/json; charset=utf-8',
    'internxt-version': '1.0.0',
    'internxt-client': 'drive-mobile',
    'Authorization': `Bearer ${process.env.REACT_APP_XTOKEN}`,
    'internxt-mnemonic': process.env.REACT_APP_MNEMONIC
  }
  //console.log('headersss:', h)

  const newPreview = await fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/previews/${previewId}`, { method: 'GET', headers: h })
  const blob = await newPreview.blob()
  
  const url = URL.createObjectURL(blob)
  const objectToStore = { blob: blob, type: 'image/jpeg', previewId }
  const existsPreview = await dataBase.get('photos', previewId)

  if (!existsPreview) {
    await putValue('photos', objectToStore, dataBase)
    return false
  }
  return true
}

export function downloadPreviews(dataBase: IDBPDatabase<unknown>, getPreviewFromDB: (previewId: string) => void, matchImages?: any): Promise<any> {
  return getUploadedPhotos(matchImages).then((res) => {
    return mapSeries(res, (photo, next) => {
      return downloadPreview(photo.preview, dataBase).then((exists) => {
        if (photo.preview && photo.preview.fileId && !exists) {
          getPreviewFromDB(photo.preview.fileId)
        } else {
          if (exists) console.log('Preview already stored on DB!')
          else console.log('Error while preparing preview for download: preview or preview.fileId null')
        }
        console.log('\n -------------------------- NEXT PHOTO -------------------------- \n')
        next(null, photo)
      })
    })
  })
}