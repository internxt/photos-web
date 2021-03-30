import { IDBPDatabase, openDB } from "idb"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { getAllValues, getValue } from "../../lib/utils/indexedDB"
import { downloadPreviews } from "../../screens/Home/init"
import Photo from "../Photo"

interface AllPhotosProps {
  dataBase: IDBPDatabase<unknown>,
}

interface IPreview {
  blob: Blob,
  type: string,
  previewId: string
}

export interface IRenderablePreview extends IPreview {
  src: string
}

const AllPhotos = (props: AllPhotosProps) => {
  const [photosToRender, setPhotosToRender] = useState<IRenderablePreview[]>([])
  const history = useHistory()

  const getPreviewFromDB = (previewId: string): void => {
    getValue('photos', previewId, props.dataBase).then((photo: IPreview) => {
      if (photo) {
        const preview: IRenderablePreview = { ...photo, src: URL.createObjectURL(photo.blob) }
        setPhotosToRender(prevState => [...prevState, preview])
      }
    })
  }

  useEffect(() => {
    getAllValues('photos', props.dataBase).then((photos: IPreview[]) => {
      return photos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
    }).then((previews: IRenderablePreview[]) => setPhotosToRender(previews))
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
            photosToRender.map(photo => <Photo photo={photo} isSelective={false} />)
            :
            <span>chill bro you dont have photos</span>
        }
      </div>
    </div>
  )
}

export default AllPhotos;