import styles from './home.module.scss'
import Header from '../../layout/Header';
import AllPhotos from '../../components/AllPhotos';
import { useEffect, useState } from 'react';
import { IDBPDatabase } from 'idb';
import Albums from '../../components/Albums';
import { getAllValues, getValue } from '../../lib/utils/indexedDB';
import { IRenderablePreview, IStoredPreview } from '../../lib/types/photos';
import { downloadPreviews } from './init';

interface HomeProps {
  database: IDBPDatabase<unknown>
}

const Home = (props: HomeProps) => {
  const [photosToRender, setPhotosToRender] = useState<IRenderablePreview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getPreviewFromDB = (previewId: IDBValidKey | IDBKeyRange): void => {
    getValue('photos', previewId, props.database).then((photo: IStoredPreview) => {
      if (photo) {
        const preview: IRenderablePreview = { ...photo, src: URL.createObjectURL(photo.blob) }
        setPhotosToRender(prevState => [...prevState, preview])
      }
    })
  }

  // get all previews from the db and start downloading previews
  useEffect(() => {
    getAllValues('photos', props.database).then((photos: IStoredPreview[]) => {
      return photos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
    }).then((previews: IRenderablePreview[]) => {
      setPhotosToRender(previews)
      downloadPreviews(props.database, getPreviewFromDB)
    }).catch(err => console.log('getAllValues catch =>', err))
  }, [])

  return (
    <div className={`${styles.mainContainer}`}>
      <Header
        showFileButtons={true}
        showSettingsButton={true}
      />

      <Albums database={props.database} photosToRender={photosToRender} />

      <AllPhotos database={props.database} photosToRender={photosToRender} />

      <div className={`${styles.container} ${styles.deleted}`}>deleted photos</div>
    </div>
  )
}

export default Home;