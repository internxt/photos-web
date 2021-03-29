import { IDBPDatabase, openDB } from "idb";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAllValues, getValue } from "../../lib/utils/indexedDB";
import { downloadPreviews } from "../../screens/Home/init";
import styles from './AllPhotos.module.scss'

export interface AllPhotosProps {

}

const AllPhotos = () => {
  const [photosToRender, setPhotosToRender] = useState<Array<any>>([])
  const history = useHistory()

  const getPreviewFromDB = (dataBase: IDBPDatabase<unknown>, previewId: string): void => {
    getValue('photos', previewId, dataBase).then(photo => {
      if (photo) {
        const preview = {
          ...photo,
          src: URL.createObjectURL(photo.blob)
        }
        setPhotosToRender(prevState => [...prevState, preview])
      }
    })
  }

  useEffect(() => {
    openDB('test2').then(db => {
      // get all stored photos in the database on first render
      getAllValues('photos', db).then(photos => {
        return photos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
      }).then(previews => setPhotosToRender(previews))
        .then(() => downloadPreviews(db, getPreviewFromDB))
        .catch(err => console.log('getAllValues catch =>', err))
    })
  }, [])

  return (
    <div className={`home-container`}>
      <div className={`home-titleContainer`}>
        <span className={`home-title`}
          onClick={() => {
            history.push('photos')
          }}
        >All photos</span>

        <span className={`home-filter`}>Filter</span>
      </div>

      <div className={`list-group list-group-horizontal overflow-auto ml-3 mr-3`}>
        {
          photosToRender.length > 0 ?
            photosToRender.map((photo: any) => (<img className={`${styles.photo}`} src={photo.src} key={photo.previewId} />))
            :
            <span>chill bro you dont have photos</span>
        }
      </div>
    </div>
  )
}

export default AllPhotos;