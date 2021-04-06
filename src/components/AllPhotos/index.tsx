import { IDBPDatabase } from "idb"
import { useHistory } from "react-router"
import { IRenderablePreview } from "../../lib/types/photos"
import Photo from "../Photo"

interface AllPhotosProps {
  database: IDBPDatabase<unknown>,
  photosToRender: IRenderablePreview[]
}

const AllPhotos = (props: AllPhotosProps) => {
  const history = useHistory()

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

      <div className={`list-group list-group-horizontal overflow-auto ml-3 pr-3 horizontal-scrollbar`}>
        {
          props.photosToRender.length > 0 ?
            props.photosToRender.map(photo => <Photo photo={photo} isSelective={false} key={photo.previewId} />)
            :
            <span>chill bro you dont have photos</span>
        }
      </div>
    </div>
  )
}

export default AllPhotos;