import { useEffect } from "react";
import AlbumCard, { IAlbum } from "./AlbumCard";
import a from '../../assets/images/1.jpg'
import b from '../../assets/images/2.jpg'
import c from '../../assets/images/3.jpg'
import d from '../../assets/images/4.jpg'
import e from '../../assets/images/5.jpg'
import f from '../../assets/images/6.jpg'
import g from '../../assets/images/7.jpg'
import h from '../../assets/images/8.jpg'
import i from '../../assets/images/9.jpg'
import j from '../../assets/images/10.jpg'
import k from '../../assets/images/11.jpg'
import l from '../../assets/images/12.jpg'
import m from '../../assets/images/13.jpg'
import n from '../../assets/images/14.jpg'
import o from '../../assets/images/15.jpg'

const Albums = () => {
  const albumes: IAlbum[] = [
    {
      title: 'Random shit', photos: [
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
      ]
    },
    {
      title: 'More random shit', photos: [
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'err', size: 200, type: 'jpg', photosalbums: {}, localUri: e },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'f', size: 200, type: 'jpg', photosalbums: {}, localUri: f },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'g', size: 200, type: 'jpg', photosalbums: {}, localUri: g },
      ]
    },
    {
      title: 'Even more random shit lol', photos: [
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'h', size: 200, type: 'jpg', photosalbums: {}, localUri: h },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'i', size: 200, type: 'jpg', photosalbums: {}, localUri: i },
      ]
    },
    {
      title: 'This normal', photos: [
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'j', size: 200, type: 'jpg', photosalbums: {}, localUri: j },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'drr', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dn', size: 200, type: 'jpg', photosalbums: {}, localUri: n },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dm', size: 200, type: 'jpg', photosalbums: {}, localUri: m },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'de', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'df', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'l', size: 200, type: 'jpg', photosalbums: {}, localUri: l },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dg', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'l', size: 200, type: 'jpg', photosalbums: {}, localUri: l },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'do', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dp', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'k', size: 200, type: 'jpg', photosalbums: {}, localUri: k },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'k', size: 200, type: 'jpg', photosalbums: {}, localUri: k },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'k', size: 200, type: 'jpg', photosalbums: {}, localUri: k },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dq', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
      ]
    },
    { title: 'This not normal', photos: [{ bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '../../assets/images/5.jpg' }] },
    {
      title: 'More random shit', photos: [
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dr', size: 200, type: 'jpg', photosalbums: {}, localUri: e },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: f },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: g },
      ]
    },
    {
      title: 'Even more random shit lol', photos: [
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: h },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: i },
      ]
    },
    {
      title: 'This normal', photos: [
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: j },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: k },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: l },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: m },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: n },
        { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
      ]
    }
  ]

  useEffect(() => {
    /* getAlbums().then(res => {
      //console.log('albums =>', res)
      setAlbums(res)
    }) */
  }, [])

  return (
    <div className={`home-container`}>
      <div className={`home-titleContainer`}>
        <span className={`home-title`}>Albums</span>

        <span className={`home-filter`}>Filter</span>
      </div>

      <div className={`list-group list-group-horizontal overflow-auto pl-3 pr-3`}>
        {
          albumes.map(album => (<AlbumCard album={album} key={Math.random() * 10000000} />))
        }
      </div>
    </div>
  )
}

export default Albums;