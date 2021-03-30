
import { IDBPDatabase, openDB } from 'idb';
import { useEffect, useState } from 'react';
import Header from '../../layout/Header';
import { getAllValues } from '../../lib/utils/indexedDB';
import styles from './PhotoGallery.module.scss'
import ActivityIndicator from '../../components/ActivityIndicator'
import Photo from '../../components/Photo';

interface PhotoGalleryProps {
  dataBase: IDBPDatabase<unknown>
}

const PhotoGallery = (props: PhotoGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [photosToRender, setPhotosToRender] = useState<any[]>([])
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined)

  useEffect(() => {
    openDB('test2').then(db => {
      // get all stored photos in the database on first render
      getAllValues('photos', db).then(photos => {
        return photos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
      }).then(previews => setPhotosToRender(previews))
        .finally(() => setIsLoading(false))
    })
  }, [])

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.titleContainer}>
        <h1 className={styles.title}>
          All photos {isLoading ? <ActivityIndicator /> : null}
        </h1>

        <span className={styles.photosCount}>
          {photosToRender.length} Photos
          </span>
      </div>

      <div className={`grid grid-cols-4 gap-4 my-4 mx-auto 1080:grid-cols-5 1280:grid-cols-6 1440:grid-cols-7 1920:grid-cols-8`}>
        {
          !isLoading ?
            photosToRender.map(photo => <Photo style={`w-44 h-44 object-cover rounded-lg hover:opacity-70 cursor-pointer 1920:w-48 1920:h-48`} photo={photo} />)
            :
            null
        }
      </div>
    </div>
  )
}

export default PhotoGallery