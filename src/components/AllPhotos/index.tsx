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
  const [uploadedPhotos, setUploadedPhotos] = useState()
  const [isDownloading, setIsDownloading] = useState(false)
  const history = useHistory()

  const getPreviewFromDB = (dataBase: IDBPDatabase<unknown>, previewId: string): void => {
    getValue('photos', previewId, dataBase).then(photo => {
      if (photo) {
        setPhotosToRender(prevState => [...prevState, photo])
      }
    })
  }

  useEffect(() => {
    openDB('test2').then(db => {
      console.log('dataBase opened =>', db)

      // get all stored photos in the database on first render
      getAllValues('photos', db).then(photos => {
        console.log('all photos useEffect =>', photos.length)
        setPhotosToRender(photos)
      })

      downloadPreviews(db, getPreviewFromDB).then(previews => {
        setUploadedPhotos(previews)
      }).catch((err) => {
        console.log('getPreviews catch =>', err)
      }).finally(() => {
        setIsDownloading(false)
      })
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