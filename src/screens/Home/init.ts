import { mapSeries } from "async"
import { IDBPDatabase, openDB } from "idb"
import { IAlbum } from "../../lib/types/albums"
import { IApiPhotoWithPreview, IApiUploadedPhoto } from "../../lib/types/photos"
import { getHeaders } from "../../lib/utils/auth"
import { putValue } from "../../lib/utils/indexedDB"

export const getAlbums = (): Promise<IAlbum[]> => {
  const headers = getHeaders(true, true)
  const h = {
    'content-type': 'application/json; charset=utf-8',
    'internxt-version': '1.0.0',
    'internxt-client': 'drive-mobile',
    'Authorization': `Bearer ${process.env.REACT_APP_XTOKEN}`,
    'internxt-mnemonic': process.env.REACT_APP_MNEMONIC
  }

  return fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/photosalbum`, {
    method: 'GET',
    headers: h
  }).then(res => {
    return res.json()
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

export function getUploadedPhotos(matchImages?: any): Promise<IApiUploadedPhoto[]> {
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

export async function downloadPreview(uploadedPhoto: IApiUploadedPhoto, dataBase: IDBPDatabase<unknown>): Promise<any> {
  if (!uploadedPhoto.preview) {
    return Promise.resolve();
  }
  const xToken = localStorage.getItem('xToken')
  const xUser = localStorage.getItem('xUser')
  const xUserJson = JSON.parse(xUser || '{}')
  const previewType = uploadedPhoto.preview.type
  const previewId = uploadedPhoto.preview.fileId
  const headers = getHeaders(true, true)
  const h = {
    'content-type': 'application/json; charset=utf-8',
    'internxt-version': '1.0.0',
    'internxt-client': 'drive-mobile',
    'Authorization': `Bearer ${process.env.REACT_APP_XTOKEN}`,
    'internxt-mnemonic': process.env.REACT_APP_MNEMONIC
  }

  try {
    console.log('uploadedPhoto =>', uploadedPhoto)
    const newPreview = await fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/previews/${previewId}`, { method: 'GET', headers: h })
    const blob = await newPreview.blob()
    const objectToStore = { blob: blob, originalPhotoId: uploadedPhoto.id, previewId, originalPhotoName: uploadedPhoto.name }
    const existsPreview = await dataBase.get('photos', previewId)

    if (!existsPreview) {
      await putValue('photos', objectToStore, uploadedPhoto.id, dataBase)
      return false
    }
    return true
  } catch (err) {
    console.log('Error =>', err)
    return true
  }
}

export function downloadPreviews(dataBase: IDBPDatabase<unknown>, getPreviewFromDB: (previewId: string) => void, matchImages?: any): Promise<any> {
  return getUploadedPhotos(matchImages).then((uploadedPhotos) => {
    return mapSeries(uploadedPhotos, (photo, next) => {
      return downloadPreview(photo, dataBase).then((exists) => {
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