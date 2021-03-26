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

export async function downloadPreview(preview: any, photo: IApiPhotoWithPreview, dataBase: IDBPDatabase<unknown>): Promise<any> {
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

  return fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/previews/${previewId}`, {
    method: 'GET',
    headers: h
  }).then(preview => {
    return preview.blob()
  }).then(blob => URL.createObjectURL(blob))
    .then(url => {
      const preview = {
        src: url,
        type: 'image/jpeg',
        previewId
      }

      return putValue('photos', preview, dataBase)
    }).catch(err => {
      console.log('Error while downloading the preview =>', err)
    })
}

export function downloadPreviews(dataBase: IDBPDatabase<unknown>, getPreviewFromDB: (dataBase: IDBPDatabase<unknown>, previewId: string) => void, matchImages?: any): Promise<any> {
  return getUploadedPhotos(matchImages).then((res) => {
    return mapSeries(res, (photo, next) => {
      return downloadPreview(photo.preview, photo, dataBase).then(() => {
        console.log('\n -------------------------- NEXT PHOTO -------------------------- \n')
        if (photo.preview && photo.preview.fileId) {
          getPreviewFromDB(dataBase, photo.preview.fileId)
        } else console.log('Error while preparing preview for download: preview or preview.fileId null')
        next(null, photo)
      })
    })
  })
}