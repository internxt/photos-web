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
  const [albumPhotos, setAlbumPhotos] = useState(props.album.photos)
  const title = props.album.name
  const [coverPhoto, setCoverPhoto] = useState<any>()
  const [coverPhotos, setCoverPhotos] = useState<IRenderablePreview[]>([])
  const [secondaryPhotos, setSecondaryPhotos] = useState<IRenderablePreview[]>([])
  const [emptyCoverSpaces, setEmptyCoverSpaces] = useState<any[]>([])
  const [emptySecondarySpaces, setEmptySecondarySpaces] = useState<any[]>([])

  // set the three main photos of the album and remove them from the rest of the array
  useEffect(() => {
    getAllValues('photos', props.database).then((previews: IStoredPreview[]) => {
      // Set the first selected picture as the cover photo of the album and transform it from a blob
      const albumCoverPhoto = previews.find(preview => preview.originalPhotoId === albumPhotos[0].id)
      const renderableCover = { ...albumCoverPhoto, src: URL.createObjectURL(albumCoverPhoto?.blob) }

      let mainPhotos: any[] = []
      let otherPhotos: IStoredPreview[] = []
      let mainRenderablePreviews: IRenderablePreview[] = []
      let secondaryRenderablePreviews: IRenderablePreview[] = []

      if (albumPhotos.length >= 2) {
        if (albumPhotos.length >= 3) {
          // The three main photos
          mainPhotos = previews.filter(preview => preview.originalPhotoId === albumPhotos[1].id || preview.originalPhotoId === albumPhotos[2].id)
          // The rest of the photos
          for (let i = 0; i < previews.length; i++) {
            for (let j = 0; j < albumPhotos.length; j++) {
              if (previews[i].originalPhotoId === albumPhotos[j].id) {
                const preview = previews[i]

                otherPhotos.push(preview)
              }
            }
          }

          // Transforming the blobs to render the filtered previews
          mainRenderablePreviews = mainPhotos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
          secondaryRenderablePreviews = otherPhotos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
        } else {
          mainPhotos = [previews.find(preview => preview.originalPhotoId === albumPhotos[1].id)]

          mainRenderablePreviews = mainPhotos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
        }

        setCoverPhotos(mainRenderablePreviews)
        setSecondaryPhotos(secondaryRenderablePreviews)
      }
      const gridSize = 9
      const coverGridSize = 2
      const emptySecondaryItems = Array.from({ length: gridSize - otherPhotos.length })
      const emptyCoverItems = Array.from({ length: coverGridSize - mainPhotos.length })

      setCoverPhoto(renderableCover)
      setEmptyCoverSpaces(emptyCoverItems)
      setEmptySecondarySpaces(emptySecondaryItems)
    })
  }, [])

  const renderItem = (photo: IRenderablePreview, index: number) => <img className={index === 0 ? `${styles.photo} ${styles.roundedBottomLeft}` : `${styles.photo}`} src={photo.src} key={photo.previewId} />
  const renderEmptyItem = (_: any, index: number) => <div key={index} className={`${styles.emptyItem}`}></div>
  const previewNotYetDownloaded = () => <span className={`${styles.photo}`}>Preview yet not downloaded</span>

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

      <span className={styles.albumTitle}>{title} <span className={styles.albumSubtitle}>{albumPhotos.length} photos</span></span>
    </div>
  )
}

export default AlbumCard;