import styles from './albumCard.module.scss'
import { useEffect, useState } from 'react';

export interface IAlbum {
  title: string,
  createdAt?: string,
  updatedAt?: string,
  id?: number,
  name?: string,
  photos: IAlbumPhoto[],
  userId?: string
}

interface IAlbumPhoto {
  bucketId: string,
  fileId: string,
  id: number,
  userId: number,
  createdAt: string,
  updatedAt: string,
  name: string,
  hash: string,
  size: number,
  type: string,
  photosalbums: any,
  localUri?: string
}

interface AlbumCardProps {
  album: IAlbum
}

const AlbumCard = (props: AlbumCardProps) => {
  const [photos, setPhotos] = useState(props.album.photos)
  const title = props.album.title
  const coverPhoto = props.album.photos[0]
  const [albumCoverPhotos, setAlbumCoverPhotos] = useState<IAlbumPhoto[]>([])
  const [secondaryPhotos, setSecondaryPhotos] = useState<IAlbumPhoto[]>([])
  const [emptyCoverSpaces, setEmptyCoverSpaces] = useState<unknown[]>([])
  const [emptySecondarySpaces, setEmptySecondarySpaces] = useState<unknown[]>([])

  // set the three main photos of the album and remove them from the rest of the array
  useEffect(() => {
    let mainPhotos = []
    let otherPhotos = []

    if (photos.length >= 2) {
      if (photos.length >= 3) {
        mainPhotos = [photos[1], photos[2]]
        otherPhotos = photos.slice(3)

      } else {
        mainPhotos = [photos[1]]
        otherPhotos = photos.slice(2)
      }

      setAlbumCoverPhotos(mainPhotos)
      setSecondaryPhotos(otherPhotos)
    }
    const gridSize = 9
    const coverGridSize = 2
    const emptySecondaryItems = Array.from({ length: gridSize - otherPhotos.length })
    const emptyCoverItems = Array.from({ length: coverGridSize - mainPhotos.length })

    setEmptyCoverSpaces(emptyCoverItems)
    setEmptySecondarySpaces(emptySecondaryItems)
  }, [])

  console.log('render')
  const renderItem = (photo: IAlbumPhoto, index: number) => (<img className={ index === 0 ? `${styles.photo} ${styles.roundedBottomLeft}` : `${styles.photo}` } src={photo.localUri} key={Math.random() * 100000} />)
  const renderEmptyItem = (_:any, index: number) => (<div key={index} className={`${styles.emptyItem}`}></div>)

  return (
    <div>
      <div className={`${styles.card}`}>
        <div className={`${styles.albumCover}`}>
          <img className={`${styles.primaryCoverPhoto}`} src={coverPhoto.localUri} />

          <div className={`${styles.secondaryCoverPhotos}`}>
            { albumCoverPhotos.map(renderItem) }
            { emptyCoverSpaces.map(renderEmptyItem) }
          </div>
        </div>

        <div className={`${styles.photosList}`}>
          { secondaryPhotos.map(renderItem) }
          { secondaryPhotos.length < 9 ? emptySecondarySpaces.map(renderEmptyItem) : null }
        </div>
      </div>

      <span className={styles.albumTitle}>{title} <span className={styles.albumSubtitle}>{photos.length} photos</span></span>
    </div>
  )
}

export default AlbumCard;