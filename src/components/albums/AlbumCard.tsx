import styles from './albumCard.module.scss'
import { useEffect, useState } from 'react'
import { IDBPDatabase } from 'idb'
import { getAllValues } from '../../lib/utils/indexedDB'
import { IRenderablePreview, IStoredPreview } from '../../lib/types/photos'
import { IAlbum } from '../../lib/types/albums'

interface AlbumCardProps {
  album: IAlbum,
  database: IDBPDatabase<unknown>,
  photosToRender: IRenderablePreview[]
}

const AlbumCard = (props: AlbumCardProps) => {
  const [albumPhotos, setAlbumPhotos] = useState(props.album.photos)
  const title = props.album.name
  const [coverPhoto, setCoverPhoto] = useState<any>()
  const [coverPhotos, setCoverPhotos] = useState<IRenderablePreview[] | undefined>([])
  const [secondaryPhotos, setSecondaryPhotos] = useState<IRenderablePreview[]>([])
  const [emptyCoverSpaces, setEmptyCoverSpaces] = useState<any[]>([])
  const [emptySecondarySpaces, setEmptySecondarySpaces] = useState<any[]>([])

  useEffect(() => {
    if (props.photosToRender) {
      // The albumCover is the first image selected by the user while creating the album
      const albumCoverPhoto = props.photosToRender.find(preview => preview.originalPhotoId === albumPhotos[0].id)
      let mainPhotos: IRenderablePreview[] | undefined = []
      let otherPhotos: IRenderablePreview[] = []

      if (albumPhotos.length >= 3) {
        // The two main photos
        mainPhotos = props.photosToRender.filter(preview => preview.originalPhotoId === albumPhotos[1].id || preview.originalPhotoId === albumPhotos[2].id)
        
        // Reduce the album array to create an object of objects with the id as a primary key
        const newAlbumPhotos = albumPhotos.slice(3)
        const lookup = newAlbumPhotos.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})

        // The rest of the photos
        otherPhotos = props.photosToRender.filter(preview => lookup.hasOwnProperty(preview.originalPhotoId))
      } else if (albumPhotos.length >= 2) {
        const photo = props.photosToRender.find(preview => preview.originalPhotoId === albumPhotos[1].id)
        mainPhotos = photo ? [photo] : undefined
      }

      const gridSize = 9
      const coverGridSize = 2
      const emptyCoverItems = Array.from({ length: coverGridSize - (mainPhotos ? mainPhotos.length : 0) })
      const emptySecondaryItems = Array.from({ length: gridSize - otherPhotos.length })

      setCoverPhoto(albumCoverPhoto)
      setCoverPhotos(mainPhotos)
      setSecondaryPhotos(otherPhotos)
      setEmptyCoverSpaces(emptyCoverItems)
      setEmptySecondarySpaces(emptySecondaryItems)
    }
  }, [props.photosToRender])

  useEffect(() => {
    if (!props.photosToRender) {
      const gridSize = 9
      const coverGridSize = 2
      const emptyCoverItems = Array.from({ length: coverGridSize })
      const emptySecondaryItems = Array.from({ length: gridSize })

      setEmptyCoverSpaces(emptyCoverItems)
      setEmptySecondarySpaces(emptySecondaryItems)
    }
  }, [])

  const renderItem = (photo: IRenderablePreview, index: number) => <img className={index === 0 ? `${styles.photo} ${styles.roundedBottomLeft}` : `${styles.photo}`} src={photo.src} key={photo.previewId} />
  const renderEmptyItem = (_?: any, index?: number) => <div key={index} className={`${styles.emptyItem}`}></div>
  const previewNotYetDownloaded = () => <span className={`${styles.photo}`}>Preview yet not downloaded</span>

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={`${styles.card}`}>
        <div className={`${styles.albumCover}`}>
          {coverPhoto
            ? <img className={`${styles.primaryCoverPhoto}`} src={coverPhoto?.src} />
            : <div className={`${styles.emptyItem} ${styles.cover}`}></div>
          }

          <div className={`${styles.secondaryCoverPhotos}`}>
            {coverPhotos && coverPhotos.length > 1
              ? coverPhotos.map(renderItem)
              : emptyCoverSpaces.map(renderEmptyItem)
            }
          </div>
        </div>

        <div className={`${styles.photosList} scrollbar`}>
          {secondaryPhotos.map(renderItem)}
          {secondaryPhotos.length < 9 ? emptySecondarySpaces.map(renderEmptyItem) : null}
        </div>
      </div>

      <span className={styles.albumTitle}>{title} <span className={styles.albumSubtitle}>{albumPhotos.length} photos</span></span>
    </div>
  )
}

export default AlbumCard