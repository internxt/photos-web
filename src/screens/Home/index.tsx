import AlbumCard, { IAlbum } from '../../components/albums/AlbumCard';
import styles from './home.module.scss'
import a from '../../assets/images/1.webp'
import b from '../../assets/images/2.webp'
import c from '../../assets/images/3.webp'
import d from '../../assets/images/4.webp'
import e from '../../assets/images/5.webp'
import f from '../../assets/images/6.webp'
import g from '../../assets/images/7.webp'
import h from '../../assets/images/8.webp'
import i from '../../assets/images/9.webp'
import j from '../../assets/images/10.webp'
import k from '../../assets/images/11.webp'
import l from '../../assets/images/12.webp'
import m from '../../assets/images/13.webp'
import n from '../../assets/images/14.webp'
import o from '../../assets/images/15.webp'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useState } from 'react';

export interface IHome {

}

interface IPhoto {
  bucketId: string,
  fileId: string,
  id: number,
  userId: number,
  createdAt: string,
  updatedAt: string,
  name: string,
  hash: string,
  size: 200,
  type: string,
  photosalbums: any,
  localUri: string
}

const Home = (props: IHome) => {
  const [hasMore, setHasMore] = useState(false)
  const [photosToRender, setPhotosToRender] = useState<IPhoto[]>([])
  const [initialIndex, setInitialIndex] = useState(0)
  const [lastIndex, setLastIndex] = useState(10)
  const [isDownloading, setIsDownloading] = useState(true)

  const WINDOW_WIDTH = window.innerWidth

  const albums: IAlbum[] = [
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
    { title: 'This not normal', photos: [{ bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '../../assets/images/5.webp' }] },
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
    },
  ]

  const photos: IPhoto[] = [
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'j', size: 200, type: 'jpg', photosalbums: {}, localUri: j },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'drr', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dn', size: 200, type: 'jpg', photosalbums: {}, localUri: n },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dm', size: 200, type: 'jpg', photosalbums: {}, localUri: m },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
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
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'drr', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dn', size: 200, type: 'jpg', photosalbums: {}, localUri: n },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dm', size: 200, type: 'jpg', photosalbums: {}, localUri: m },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
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
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'drr', size: 200, type: 'jpg', photosalbums: {}, localUri: o },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dn', size: 200, type: 'jpg', photosalbums: {}, localUri: n },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dm', size: 200, type: 'jpg', photosalbums: {}, localUri: m },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
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
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: a },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: b },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: c },
    { bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: d },
  ]

  /* const loadUploadedPhotos = async (matchImages?: any) => {
    setIsDownloading(true);
    getPreviews(matchImages).then(res => {
      setUploadedPhotos(res)
    }).then(() => {
      setIsLoading(false)
    }).catch(() => {
    }).finally(() => {
      setIsDownloading(false);
    })
  }

  const getNextImages = (after?: string | undefined) => {
    setIsLoading(true)
    if (photos.length < 10) {
      const lastindex = photos.length
      const newPhotos = photos.slice(initialIndex, lastindex)

      setPhotosToRender(newPhotos)
    } else {
      setHasMore(true)

      const lastindex = lastIndex
      const newPhotos = photos.slice(initialIndex, lastindex)

      setInitialIndex(lastindex)
      if (photos.length > initialIndex + 10) {

      }
    }
  } */

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={`${styles.container} ${styles.albums}`}>
        <div className={`${styles.titleContainer}`}>
          <span className={`${styles.title}`}>Albums</span>

          <span className={`${styles.filter}`}>Filter</span>
        </div>

        <div className={`${styles.list}`}>
          {albums.map(album => (<AlbumCard album={album} key={Math.random() * 10000000} />))}
        </div>
      </div>

      <div className={`${styles.container} ${styles.all}`}>
        <div className={`${styles.titleContainer}`}>
          <span className={`${styles.title}`}>All photos</span>

          <span className={`${styles.filter}`}>Filter</span>
        </div>

        <div className={`${styles.list}`}>
          { photos.map(photo => <img src={photo.localUri} className={styles.photo} />) }
        </div>
        {/* <InfiniteScroll
          dataLength={photos.length}
          next={getNextImages}
          hasMore={hasMore}
        >

        </InfiniteScroll> */}
      </div>

      <div className={`${styles.container} ${styles.deleted}`}>deleted photos</div>
    </div>
  )
}

export default Home;