import { IAlbum } from "../../components/albums/AlbumCard"
import { getHeaders, getHeadersPhotos } from "../../lib/utils/auth"

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