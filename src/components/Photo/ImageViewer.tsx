import { IRenderablePreview } from '../../lib/types/photos';
import styles from './ImageViewer.module.scss'

export interface ImageViewerProps {
  isHidden: boolean,
  handleClick: () => void,
  photo: IRenderablePreview
}
 
const ImageViewer = (props: ImageViewerProps) => {

  return (
    <div className={props.isHidden ? `${styles.hidden}` : `${styles.container}`} onClick={props.handleClick}>
      <img src={props.photo.src} className={`${styles.photo}`} />
    </div>
  )
}
 
export default ImageViewer;