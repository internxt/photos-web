import { IDBPDatabase, openDB } from "idb";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getAllValues, getValue } from "../../lib/utils/indexedDB";
import { downloadPreviews } from "../../screens/Home/init";
import styles from './AllPhotos.module.scss'

export interface AllPhotosProps {
  dataBase: IDBPDatabase<unknown>,
}

const AllPhotos = (props: AllPhotosProps) => {
  const [photosToRender, setPhotosToRender] = useState<Array<any>>([])
  const history = useHistory()

  const getPreviewFromDB = (previewId: string): void => {
    getValue('photos', previewId, props.dataBase).then(photo => {
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
    getAllValues('photos', props.dataBase).then(photos => {
      return photos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
    }).then(previews => setPhotosToRender(previews))
      .then(() => downloadPreviews(props.dataBase, getPreviewFromDB))
      .catch(err => console.log('getAllValues catch =>', err))
  }, [])

  return (
    <div className={`home-container`}>
      <div className={`home-titleContainer`}>
        <span className={`home-title`}
          onClick={() => {
            history.push('gallery')
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