import styles from './albumCard.module.scss'
import { useEffect, useState } from 'react';
import { IDBPDatabase } from 'idb';
import { getAllValues, getValue } from '../../lib/utils/indexedDB';
import { IRenderablePreview, IStoredPreview } from '../../lib/types/photos';
import { IAlbum } from '../../lib/types/albums';

interface AlbumCardProps {
  album: IAlbum,
  database: IDBPDatabase<unknown>
}

const AlbumCard = (props: AlbumCardProps) => {
  const [photos, setPhotos] = useState(props.album.photos)
  const title = props.album.name
  const [coverPhoto, setCoverPhoto] = useState<any>()
  const [coverPhotos, setCoverPhotos] = useState<IRenderablePreview[]>([])
  const [secondaryPhotos, setSecondaryPhotos] = useState<IRenderablePreview[]>([])
  const [emptyCoverSpaces, setEmptyCoverSpaces] = useState<any[]>([])
  const [emptySecondarySpaces, setEmptySecondarySpaces] = useState<any[]>([])

  // set the three main photos of the album and remove them from the rest of the array
  useEffect(() => {
    console.log('album =>', props.album)
    getAllValues('photos', props.database).then((previews: IStoredPreview[]) => {
      const cover = previews.find(preview => preview.originalPhotoId === photos[0].id)
      const renderableCover = { ...cover, src: URL.createObjectURL(cover?.blob) }
      setCoverPhoto(renderableCover)
      let mainPhotos: any[] = []
      let otherPhotos: IStoredPreview[] = []
      let mainRenderablePreviews: IRenderablePreview[] = []
      let secondaryRenderablePreviews: IRenderablePreview[] = []

      if (photos.length >= 2) {
        if (photos.length >= 3) {
          // The three main photos
          mainPhotos = previews.filter(preview => preview.originalPhotoId === photos[1].id || preview.originalPhotoId === photos[2].id)
          // The rest of the array
          otherPhotos = previews.filter(preview => preview.originalPhotoId !== photos[1].id || preview.originalPhotoId !== photos[2].id)

          // Transforming the blobs to render the filtered previews
          mainRenderablePreviews = mainPhotos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
          secondaryRenderablePreviews = otherPhotos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
        } else {
          mainPhotos = [previews.find(preview => preview.originalPhotoId === photos[1].id)]
          otherPhotos = previews.filter(preview => preview.originalPhotoId !== photos[1].id)

          mainRenderablePreviews = mainPhotos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
          secondaryRenderablePreviews = otherPhotos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
        }

        setCoverPhotos(mainRenderablePreviews)
        setSecondaryPhotos(secondaryRenderablePreviews)
      }
      const gridSize = 9
      const coverGridSize = 2
      const emptySecondaryItems = Array.from({ length: gridSize - otherPhotos.length })
      const emptyCoverItems = Array.from({ length: coverGridSize - mainPhotos.length })

      setEmptyCoverSpaces(emptyCoverItems)
      setEmptySecondarySpaces(emptySecondaryItems)
    })
  }, [])

  const renderItem = (photo: IRenderablePreview, index: number) => <img className={index === 0 ? `${styles.photo} ${styles.roundedBottomLeft}` : `${styles.photo}`} src={photo.src} key={photo.previewId} />
  const renderEmptyItem = (_: any, index: number) => <div key={index} className={`${styles.emptyItem}`}></div>

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={`${styles.card}`}>
        <div className={`${styles.albumCover}`}>
          <img className={`${styles.primaryCoverPhoto}`} src={coverPhoto?.src} />

          <div className={`${styles.secondaryCoverPhotos}`}>
            {coverPhotos.map(renderItem)}
            {emptyCoverSpaces.map(renderEmptyItem)}
          </div>
        </div>

        <div className={`${styles.photosList}`}>
          {secondaryPhotos.map(renderItem)}
          {secondaryPhotos.length < 9 ? emptySecondarySpaces.map(renderEmptyItem) : null}
        </div>
      </div>

      <span className={styles.albumTitle}>{title} <span className={styles.albumSubtitle}>{photos.length} photos</span></span>
    </div>
  )
}

export default AlbumCard;